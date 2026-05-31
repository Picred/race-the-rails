import sqlite from "sqlite3";
import crypto from "crypto";
import dayjs from "dayjs";

import { Route, Event, Station } from "../models.js";


const db = new sqlite.Database("./db/rails.sqlite", async (err) => {
    if (err) throw err;
    //   await db.get("PRAGMA foreign_keys = ON"); // di default la gestione attiva delle chiavi esterne non è abilitata. mi fa inserire ugualmente valori che non rispettano la FK
});

// authentication
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

export const list_stations = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM stations;";
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve([]);
            else {
                const stations = rows.map((row) => new Station(row.station_name));
                return resolve(stations);
            }
        });
    });
}

export const list_routes = async () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM routes r, stations s WHERE r.station_id = s.station_id ORDER BY line_name, stop_sequence;";
        db.all(sql, (err, rows) => {
            if (err) reject(err);
            else if (rows.length === 0) resolve([]);
            else {
                const routes = rows.map((row) => new Route(row.line_name, row.station_id, row.station_name, row.stop_sequence));
                return resolve(routes);
            }
        });
    });
}


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


const get_random_end_route_step = (all_routes, random_start_route_step) => {
    const distances = calculate_distances_from_station(all_routes, random_start_route_step);

    // distances[0] = undefined sempre, le station_id partono da 1!

    const valid_end_stations = all_routes.filter((route) => {
        const distance = distances[route.station_id];
        return distance !== undefined && distance >3;
    });

    let random_index = Math.floor(Math.random() * valid_end_stations.length);

    if(random_index === 0) random_index += 1;
    return valid_end_stations[random_index];
}

const insert_new_game = async (user_id, start_time, start_station_id, end_station_id) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO games(user_id, score, start_time, start_station_id, end_station_id) VALUES (?, ?, ?, ?, ?);"
        db.run(sql, [user_id, 0, start_time, start_station_id, end_station_id], function (err) {
            if(err) reject(err);
            else resolve(this.lastID);
        });
    });
}


export const create_new_game = async (user_id) => {
    // select random start/end stations from routes
    const routes = await list_routes();
    
    let random_index;
    let random_start_route_step;
    let random_end_route_step;

    do{ // a volte la start station non ha stazioni a distanza > 3
        random_index = Math.floor(Math.random() * routes.length);
        random_start_route_step = routes[random_index];
        random_end_route_step = get_random_end_route_step(routes, random_start_route_step);
    }while (random_end_route_step === undefined);


    // insert game in table + Date now
    let created_game_id;
    try{
        created_game_id = await insert_new_game(
            user_id, dayjs().toISOString(), 
            random_start_route_step.station_id, 
            random_end_route_step.station_id
        );
    }catch(err){
        console.error("created_game_id: " + err);
        throw err;
    }

    return {
        game_id: created_game_id, 
        random_start_station_id: random_start_route_step.station_id, 
        random_end_station_id: random_end_route_step.station_id
    };
}