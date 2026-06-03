import sqlite from "sqlite3";
import crypto from "crypto";

import { Event } from "../models.js";

const db = new sqlite.Database("rails.sqlite", async (err) => {
    if (err) throw err;
    await db.get("PRAGMA foreign_keys = ON"); // di default la gestione attiva delle chiavi esterne non è abilitata. mi fa inserire ugualmente valori che non rispettano la FK
});

const stations = ["Fontana", "Nesima", "Qt8", "Cibali", "Milo", "Borgo", "Giuffrida", "Centro", "Italia", "Galatea", "Porto", "Tribunale"];

const table_queries = [
    `CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS games (
      game_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER,
      start_time DATE NOT NULL,
      start_station_id INTEGER,
      end_station_id INTEGER,
      
      FOREIGN KEY(user_id) REFERENCES users(user_id),
      FOREIGN KEY(start_station_id) REFERENCES stations(station_id),
      FOREIGN KEY(end_station_id) REFERENCES stations(station_id)
    );`,
    `CREATE TABLE IF NOT EXISTS stations (
      station_id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_name TEXT UNIQUE NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS routes (
      route_id INTEGER PRIMARY KEY AUTOINCREMENT,
      line_name TEXT NOT NULL,
      station_id INTEGER NOT NULL,
      stop_sequence INTEGER NOT NULL,

      FOREIGN KEY(station_id) REFERENCES stations(station_id),
      UNIQUE(line_name, station_id)
    );`,
    `CREATE TABLE IF NOT EXISTS events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT UNIQUE NOT NULL,
      effect INTEGER NOT NULL CHECK(effect >= -4 AND effect <= 4)
    );`,
];

const events = [
    new Event("Vagone che si svuota completamente", 4),
    new Event("Treno express che anticipa i tempi", 3),
    new Event("Passeggero ti fa dei complimenti", 3),
    new Event("Posto libero davanti a te", 2),
    new Event("Porte aperte dal tuo lato", 1),

    new Event("Porte che continuano a riaprirsi", -1),
    new Event("Odore sgradevole", -2),
    new Event("Sosta prolungata", -3),
    new Event("Frenata brusca", -3),
    new Event("Guasto tecnico generico", -4),
]


const run_create_table = async (query) => {
    return new Promise((resolve, reject) => {
        db.run(query, [], function (err) {
            if (err) reject("run_create_table" + err);
            else resolve();
        });
    });
}

const init_tables = async () => {
    for (const query of table_queries) {
        try {
            await run_create_table(query);
        } catch (err) {
            console.log("CREATE TABLE:" + err);
        }
    }
};

const run_insert_station = async (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject("run_insert_station: " + err);
            else resolve();
        });
    });
}


const insert_stations = async () => {
    for (const name of stations) {
        await run_insert_station("INSERT INTO stations (station_name) VALUES (?)", [name]);
    }
};

const get_station_id_by_name = async (station_name) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM stations WHERE station_name = ?;";

        db.get(query, [station_name], (err, row) => {
            // console.log(row);
            if (err) {
                // console.log();
                reject("insert_routes1: " + err);
            }
            else resolve(row.station_id);
        });
    });
}

const insert_route = async (line_name, station_name, stop_sequence) => {
    // get station_id from station_name
    let station_id = await get_station_id_by_name(station_name);

    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO routes (line_name, station_id, stop_sequence) VALUES (?,?,?);";
        db.run(sql, [line_name, station_id, stop_sequence], function (err) {
            if (err) reject("insert_routes2: " + err);
            else resolve();
        });
    });
};

/*
    %% rossa
    Centro <==> Fontana <==> Nesima <==> QT8
    
    %% blu
    Centro <==> Cibali <==> Borgo <==> Milo <==> Galatea
    
    %% verde
    Fontana <==> Cibali <==> Italia <==> Porto
    
    %% viola
    QT8 <==> Giuffrida <==> Milo <==> Italia <==> Tribunale
*/
const create_red_line = async () => {
    await insert_route("Linea Rossa", "Centro", 1);
    await insert_route("Linea Rossa", "Fontana", 2);
    await insert_route("Linea Rossa", "Nesima", 3);
    await insert_route("Linea Rossa", "Qt8", 4);
}


const create_blue_line = async () => {
    await insert_route("Linea Blu", "Centro", 1);
    await insert_route("Linea Blu", "Cibali", 2);
    await insert_route("Linea Blu", "Borgo", 3);
    await insert_route("Linea Blu", "Milo", 4);
    await insert_route("Linea Blu", "Galatea", 5);
}

const create_green_line = async () => {
    await insert_route("Linea Verde", "Fontana", 1);
    await insert_route("Linea Verde", "Cibali", 2);
    await insert_route("Linea Verde", "Italia", 3);
    await insert_route("Linea Verde", "Porto", 4);
}

const create_orange_line = async () => {
    await insert_route("Linea Arancione", "Qt8", 1);
    await insert_route("Linea Arancione", "Giuffrida", 2);
    await insert_route("Linea Arancione", "Milo", 3);
    await insert_route("Linea Arancione", "Italia", 4);
    await insert_route("Linea Arancione", "Tribunale", 5);
}



// ---------
// USER INIT
const run_insert_user = async (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject("insert_user:" + err);
            else resolve();
        });
    });
}

const insert_users = async () => {
    const usernames = ["alice.russo@polito.it", "andrei.stefan@polito.it", "antonella.ferrari@polito.it", "claudia.romano@polito.it"];
    const passwords = ["alicepsw", "andreipsw", "antonellapsw", "claudiapsw"];
    const salts = ["0fe16f155b1ec26c", "c19978b665a7ff7b", "5f8fb817e306aba1", "2d5ad9dc12be4c66"];
    const hashed_psws = ["a4bda2b2cf9d64b344fdb6df2d2da36c", "b3c8d806204d5494ee65f2afa054b39c", "beded4028cb56158e0a916f5c29ad5e2", "363bd82c1c1b59b9037fb258bec0ab69"]

    for (const i in usernames) {
        await run_insert_user("INSERT INTO users (username, password, salt) VALUES (?, ?, ?);", [usernames[i], hashed_psws[i], salts[i]]);
    }
}


const run_insert_events = async (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve();
        })
    });
}

const insert_events = async () => {
    for (const event of events) {
        await run_insert_events("INSERT INTO events (description, effect) VALUES (?, ?);", [event.description, event.effect]);
    }
}


// DB INIT + STATIONS + ROUTES + USERS + EVENTS
try {
    await init_tables();
    await insert_stations();

    await create_red_line();
    await create_blue_line();
    await create_green_line();
    await create_orange_line();

    await insert_users();
    await insert_events();
} catch (err) {
    console.error(err);
}