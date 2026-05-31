import sqlite from "sqlite3";
import crypto from "crypto";

import { Route, Event, Station } from "../models.js";


const db = new sqlite.Database("./db/rails.sqlite", async (err) => {
    if (err) throw err;
    //   await db.get("PRAGMA foreign_keys = ON"); // di default la gestione attiva delle chiavi esterne non è abilitata. mi fa inserire ugualmente valori che non rispettano la FK
});

// authentication
export const get_user = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';

        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            else if (row === undefined) resolve(false);
            else {
                const user = { id: row.user_id, username: row.username };

                const salt = row.salt;
                crypto.scrypt(password, salt, 16, (err, hashed_password) => {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashed_password))
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


// const routes = await list_routes();
// console.log(routes);