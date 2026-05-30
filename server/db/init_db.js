import sqlite from "sqlite3";
import crypto from "crypto";

import { LineStation } from "../models.js";

const db = new sqlite.Database("rails.sqlite", async (err) => {
  if (err) throw err;
  await db.get("PRAGMA foreign_keys = ON"); // di default la gestione attiva delle chiavi esterne non è abilitata. mi fa inserire ugualmente valori che non rispettano la FK
});

const stations = ["Fontana", "Nesima", "QT8", "Cibali", "Milo", "Borgo", "Giuffrida", "Centro", "Italia", "Galatea", "Porto", "Tribunale"];

const table_queries = [
  `CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      salt TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS games (
      game_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      
      FOREIGN KEY(user_id) REFERENCES users(user_id)
    );`,
  `CREATE TABLE IF NOT EXISTS stations (
      station_id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_name TEXT UNIQUE NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS lines_stations (
      line_station_id INTEGER PRIMARY KEY AUTOINCREMENT,
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

const init_db = () => {
  for (const query of table_queries) {
    db.run(query, undefined, function (err) {
      if (err) {
        console.log("CREATE TABLE:" + err);
      }
    });
  }
};

const insert_stations = () => {
  for (const name of stations) {
    db.run("INSERT INTO stations (station_name) VALUES (?)", [name], function (err) {
      if (err) console.log("insert_stations " + err);
    });
  }
};

const insert_line_station = ({ line_name, station_id, stop_sequence }) => {
  const sql = "INSERT INTO lines_stations (line_name, station_id, stop_sequence) VALUES (?,?,?);";

  db.run(sql, [line_name, station_id, stop_sequence], function (err) {
    if (err) console.log("insert_lines_stations: " + err);
  });
};


const create_red_line = () => {
  insert_line_station(new LineStation(null, "Linea Rossa", 5, 1 ));
  insert_line_station(new LineStation(null, "Linea Rossa", 1, 2 ));
  insert_line_station(new LineStation(null, "Linea Rossa", 4, 3 ));
  insert_line_station(new LineStation(null, "Linea Rossa", 6, 4 ));
}


const create_blue_line = () => {
  insert_line_station(new LineStation(null, "Linea Blu", 5, 1 ));
  insert_line_station(new LineStation(null, "Linea Blu", 12, 2 ));
  insert_line_station(new LineStation(null, "Linea Blu", 3, 3 ));
  insert_line_station(new LineStation(null, "Linea Blu", 2, 4 ));
  insert_line_station(new LineStation(null, "Linea Blu", 7, 5 ));
}

const create_green_line = () => {
  insert_line_station(new LineStation(null, "Linea Verde", 1, 1 ));
  insert_line_station(new LineStation(null, "Linea Verde", 12, 2 ));
  insert_line_station(new LineStation(null, "Linea Verde", 10, 3 ));
  insert_line_station(new LineStation(null, "Linea Verde", 8, 4 ));
}

const create_orange_line = () => {
  insert_line_station(new LineStation(null, "Linea Arancione", 6, 1 ));
  insert_line_station(new LineStation(null, "Linea Arancione", 11, 2 ));
  insert_line_station(new LineStation(null, "Linea Arancione", 2, 3 ));
  insert_line_station(new LineStation(null, "Linea Arancione", 10, 4 ));
  insert_line_station(new LineStation(null, "Linea Arancione", 9, 5 ));
}


// DB INIT + STATIONS + LINES_STATIONS
// init_db();
// insert_stations();
// create_red_line();
// create_blue_line();
// create_green_line();
// create_orange_line();


// ---------
// USER INIT
const insert_users = () => {
  const usernames = ["alice", "andrei", "antonella", "claudia"];
  const passwords = ["alicepsw", "andreipsw", "antonellapsw", "claudiapsw"];
  const salts = ["0fe16f155b1ec26c", "c19978b665a7ff7b", "5f8fb817e306aba1", "2d5ad9dc12be4c66"];
  const hashed_psws = ["a4bda2b2cf9d64b344fdb6df2d2da36c", "b3c8d806204d5494ee65f2afa054b39c", "beded4028cb56158e0a916f5c29ad5e2", "363bd82c1c1b59b9037fb258bec0ab69"]

  const sql = "INSERT INTO users (username, password, salt) VALUES (?, ?, ?);"
  for (const i in usernames){
    db.run(sql, [usernames[i], hashed_psws[i], salts[i]], function (err) {
      if (err) console.log("insert_users:" + err);
    });
  }
}

// insert_users();