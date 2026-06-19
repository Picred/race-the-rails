import sqlite from "sqlite3";
import crypto from "crypto";
import dayjs from "dayjs";

import { Route, Event, Station, Game, HttpError, Leaderboard } from "../models.js";
import {
    calculate_timeshift_seconds,
    validate_start_end_stations,
    validate_route_selected,
    get_n_random_events,
    calculate_final_coins
} from "../utils/utils.js";

const START_COINS = 20;

const db = new sqlite.Database("./db/rails.sqlite", async (err) => {
    if (err) throw err;
    //   await db.get("PRAGMA foreign_keys = ON"); // di default la gestione attiva delle chiavi esterne non è abilitata. mi fa inserire ugualmente valori che non rispettano la FK
});


/**
 * [Performs the login by using credentials saved on db.]
 * @param {string} username 
 * @param {string} password 
 * @returns user information if credentials are valid.
 */
export const get_user = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?";

        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else {
                const user = { id: row.user_id, username: row.username };

                const salt = row.salt;
                crypto.scrypt(password, salt, 16, (err, hashed_password) => {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashed_password))
                        resolve(false);
                    else resolve(user);
                });
            }
        });
    });
};


/**
 * [Gets all the events]
 * @returns an array containing all the events registered on the database.
 */
export const list_events = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM events;";
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve([]);
            else {
                const events = rows.map((row) => new Event(row.description, row.effect));
                return resolve(events);
            }
        });
    });
}


/**
 * [Gets all the stations]
 * @returns an array containing all the stations saved on the database.
 */
export const list_stations = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM stations;";
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve([]);
            else {
                const stations = rows.map((row) => new Station(row.station_id, row.station_name));
                return resolve(stations);
            }
        });
    });
}


/**
 * [Gets all single steps between 2 stations (forward/backward)]
 * @param {[Object]} all_routes 
 * @returns {[Object]} an array containng all the couples of segments between stops.
 */
export const get_single_segments_from_routes = (all_routes) => {
    let computed_segments = [];
    for (let i = 0; i < all_routes.length - 1; i++) {
        const current_stop = all_routes[i];
        const next_stop = all_routes[i + 1];

        //se la fermata successiva fa parte di un'altra linea, skip
        if (current_stop.line_name === next_stop.line_name) {
            computed_segments.push({
                route_id: `${current_stop.line_name}-${current_stop.station_id}-${next_stop.station_id}`,
                line_name: current_stop.line_name,
                from_station_id: current_stop.station_id,
                from_station_name: current_stop.station_name,
                to_station_id: next_stop.station_id,
                to_station_name: next_stop.station_name,
            });

            computed_segments.push({
                route_id: `${current_stop.line_name}-${next_stop.station_id}-${current_stop.station_id}`,
                line_name: current_stop.line_name,
                from_station_id: next_stop.station_id,
                from_station_name: next_stop.station_name,
                to_station_id: current_stop.station_id,
                to_station_name: current_stop.station_name,
            });
        }
    }
    return computed_segments;
}


/**
 * [Gets all the routes]
 * @returns an array containing all the routes saved on the database.
 */
export const list_routes = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM routes r, stations s WHERE r.station_id = s.station_id ORDER BY line_name, stop_sequence;";
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve([]);
            else {
                const routes = rows.map((row) => new Route(row.route_id, row.line_name, row.station_id, row.station_name, row.stop_sequence));
                return resolve(routes);

            }
        });
    });
}


/**
 * [Calculate all the distances from a starting point]
 * @param {[Object]} all_routes 
 * @param {Object} random_start_route_step 
 * @returns an array containing all the distances from `random_start_route_step` ordered by `station_id`.
 */
const calculate_distances_from_station = (all_routes, random_start_route_step) => {
    const distances = [];
    distances[random_start_route_step.station_id] = 0;

    for (let pace = 0; pace < 5; pace++) {
        for (let r1 of all_routes) {
            for (let r2 of all_routes) {

                // Se r1 e r2 sono sulla stessa linea e sono consecutive (+1 o -1 fermata)
                if (r1.line_name === r2.line_name && Math.abs(r1.stop_sequence - r2.stop_sequence) === 1) {

                    // r1 già calcolata (stessa linea, distanza 1), allora r2 è a distanza r1 + 1
                    if (distances[r1.station_id] !== undefined) {
                        const new_distance = distances[r1.station_id] + 1; // dalla sorgente

                        // Se r2 non ancora scoperta o ho una strada piu corta
                        if (distances[r2.station_id] === undefined || new_distance < distances[r2.station_id]) {
                            distances[r2.station_id] = new_distance;
                        }
                    }
                }
            }
        }
    }
    return distances;
}


/**
 * [Generates a random and valid end route step]
 * @param {[Route]} all_routes 
 * @param {Object} random_start_route_step 
 * @returns a randomly selected end route step.
 */
const get_random_end_route_step = (all_routes, random_start_route_step) => {
    const distances = calculate_distances_from_station(all_routes, random_start_route_step);

    // distances[0] = undefined sempre, le station_id partono da 1!

    const valid_end_stations = all_routes.filter((route) => {
        const distance = distances[route.station_id];
        return distance !== undefined && distance >= 3;
    });

    let random_index = Math.floor(Math.random() * valid_end_stations.length);

    if (random_index === 0) random_index += 1;
    return valid_end_stations[random_index];
}


/**
 * [Inserts a new row on `games` table]
 * @param {Number} user_id 
 * @param {dayjs} start_time 
 * @param {Number} start_station_id 
 * @param {Number} end_station_id 
 * @returns {Promise<Number>} the id of the last game inserted on the database.
 */
const insert_new_game = async (user_id, start_time, start_station_id, end_station_id) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO games(user_id, score, start_time, start_station_id, end_station_id) VALUES (?, ?, ?, ?, ?);"
        db.run(sql, [user_id, null, start_time, start_station_id, end_station_id], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}


/**
 * [Creates a new row to insert in the `games` table on the database]
 * @param {Number} user_id 
 * @returns an object with the last `game_id` inserted and the randomly selected `start/end station ids`.
 */
export const create_new_game = async (user_id) => {
    // select random start/end stations from routes
    const routes = await list_routes();

    let random_index;
    let random_start_route_step;
    let random_end_route_step;

    do { // a volte la end station non ha stazioni a distanza >= 3
        random_index = Math.floor(Math.random() * routes.length);
        random_start_route_step = routes[random_index];
        random_end_route_step = get_random_end_route_step(routes, random_start_route_step);
    } while (random_end_route_step === undefined);


    // insert game in table + Date now
    let created_game_id;
    created_game_id = await insert_new_game(
        user_id, dayjs().toISOString(),
        random_start_route_step.station_id,
        random_end_route_step.station_id
    );

    return {
        game_id: created_game_id,
        random_start_station_id: random_start_route_step.station_id,
        random_end_station_id: random_end_route_step.station_id
    };
}


/**
 * [Get the game record from the database by its id]
 * @param {Number} game_id 
 * @returns the corresponding row on the databse, if `game_id' exists
 */
const get_game_by_id = async (game_id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM games WHERE game_id = ?;";
        db.get(sql, [game_id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}


/**
 * [Updates the score of the `user_id` on the row specified by `game_id`]
 * @param {Number} game_id 
 * @param {Number*} user_id 
 * @param {Number} final_coins 
 * @returns {Promise}
 */
const end_game_by_id = async (game_id, user_id, final_coins) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE games SET score = ? WHERE game_id = ? AND user_id = ?;";
        db.run(sql, [final_coins, game_id, user_id], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}


/**
 * [Validates the path selected accordingly to the game rules]
 * @param {Number} game_id 
 * @param {[Number]} path 
 * @returns {Game} an object containing the final coins of the game and the randomly selected events associated to the path.
 */
export const validate_game = async (game_id, path) => {
    //check path lentgh >=5 (start, 2stations, 1end)
    if (path.length < 4) throw new HttpError(400, "Percorso troppo breve. Servono almeno 3 tratte totali.");


    // check game_id
    const actual_time = dayjs();
    const game_row = await get_game_by_id(game_id);
    if (!game_row) throw new HttpError(404, "Partita non trovata!");


    const start_time = dayjs(game_row.start_time);
    const time_shift_seconds = calculate_timeshift_seconds(start_time, actual_time);
    if (time_shift_seconds > 90) throw new HttpError(408, "Tempo scaduto!");


    // check start/end stations
    const start_station_id = Number(game_row.start_station_id);
    const end_station_id = Number(game_row.end_station_id);
    const stations_are_valid = validate_start_end_stations(path, start_station_id, end_station_id);
    if (!stations_are_valid) throw new HttpError(400, "Stazione di partenza o di arrivo non combaciano.");


    // check path is valid (start_station to end_station is reachable)
    const all_routes = await list_routes();
    const route_selected_is_valid = validate_route_selected(all_routes, path);
    if (!route_selected_is_valid) throw new HttpError(400, "Sequenza di tratte selezionato non valido. Verifica gli interscambi.");


    // associate random events to single stations - event[i] <-> path[i]
    const number_of_events = path.length - 1;
    const all_events = await list_events();
    const events_selected = get_n_random_events(all_events, number_of_events);

    // calculate final coins
    let final_coins = calculate_final_coins(events_selected);
    final_coins += START_COINS;

    

    if (final_coins < 0) final_coins = 0;
    await end_game_by_id(game_id, game_row.user_id, final_coins);

    return new Game(final_coins, events_selected);
};


/**
 * [Gets the leaderboard from the `games` table grouped by user_id]
 * @returns an object containing the leaderboard of the games.
 */
export const get_leaderboard_per_user = async () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT g.game_id, u.username, MAX(g.score) AS score
            FROM games g
            JOIN users u ON g.user_id = u.user_id
            WHERE score IS NOT NULL
            GROUP BY u.user_id
            ORDER BY g.score DESC;
        `;

        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(new Leaderboard(rows));
        });
    });
}
