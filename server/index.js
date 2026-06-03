import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import { check, validationResult } from "express-validator";

import { 
    get_user, 
    list_events, 
    list_routes, 
    create_new_game, 
    validate_game,
    get_leaderboard_per_user
} from "./db/dao.js";

const server = express();
const port = 3001;
server.use(express.json());
server.use(morgan("dev"));

const cors_options = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessState: 200,
    exposedHeaders: ["WWW-Authenticate"]
};
server.use(cors(cors_options));


passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await get_user(username, password)
    if (!user)
        return callback(null, false, "Credenziali non corrette");

    return callback(null, user);
}));


passport.serializeUser(function (user, callback) { // id + username settati su get_user()
    callback(null, user);
});


passport.deserializeUser(function (user, callback) { // id + username settati su get_user()
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
        // const all_routes = await list_routes();
        return res.status(201).json({username: req.user.username});
    } catch (err) {
        console.error("Error while fetching routes: " + err);
        res.status(500).end();
        // res.status(500).json({error: "Error while fetching routes:" + err})
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
        res.status(500).json({error: err});
    }
});


server.post("/api/games/:id/validate", is_logged_in, [
    check("path").notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});

    const game_id = req.params.id;
    try{
        const game_data = await validate_game(game_id, req.body.path);
        res.json(game_data);
    }catch(err){
        console.error("validation error: " + err.message);
        res.status(err.error_code).json({error: err.message});
    }
});


server.get("/api/routes", is_logged_in, async (req, res) => {
    try {
        const routes = await list_routes();
        res.json(routes);
    } catch (err) {
        console.error(err);
        res.status(500).end({error: err.message});
    }
});


server.get("/api/leaderboard", is_logged_in, async (req, res) => {
    try{
        const leaderboard = await get_leaderboard_per_user();
        return res.json(leaderboard);

    }catch(err){
        console.error(err);
        res.status(500).json({error: err});
    }
});


server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});