import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

import { list_events, list_routes, create_new_game } from "./db/dao.js";
import { get_user } from "./db/dao.js";

const server = express();
const port = 3001;
server.use(express.json());
server.use(morgan("dev"));

const cors_options = {
    origin: "http://localhost:5173",
    credentials: true
    // optionsSuccessState: 200,
    // exposedHeaders: ["WWW-Authenticate"],
};
server.use(cors(cors_options));


passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await get_user(username, password)
    if (!user)
        return callback(null, false, "Incorrect credentials");

    return callback(null, user);
}));


passport.serializeUser(function (user, callback) { // this user is id + username
    callback(null, user);
});


passport.deserializeUser(function (user, callback) { // this user is id + username
    return callback(null, user);
});



server.use(session({
    secret: "my secret used to initialize session",
    resave: false,
    saveUninitialized: false,
}));
server.use(passport.authenticate("session"));


const is_logged_in = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    return res.status(401).json({ error: "Not authorized" });
}


server.post("/api/sessions", passport.authenticate("local"), async (req, res) => {
    try {
        const all_routes = await list_routes();
        return res.status(201).json({ user: req.user, routes: all_routes });
    } catch (err) {
        console.error("Error while fetching routes: " + err);
        res.status(500).json({error: "Error while fetching routes:" + err})
    }
}); 

server.get("/api/sessions/current", (req, res) => {
    if (req.isAuthenticated())
        res.status(200).json(req.user);
    else
        res.status(401).json({ error: "Not authenticated" });
});

server.delete("/api/sessions/current", (req, res) => {
    req.logout(() => {
        res.end();
    });
});




server.post("/api/games", is_logged_in, async (req, res) => {
    try {
        const created_game = await create_new_game(req.user.id);
        res.status(201).json(created_game);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});




server.get("/api/events", is_logged_in, async (req, res) => {
    try {
        const events = await list_events();
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});


server.get("/api/routes", async (req, res) => {
    try {
        const routes = await list_routes();
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
});



server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});