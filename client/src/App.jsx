import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router";

import { GAME_API } from "./API/game_api.js";
import { USER_API } from "./API/user_api.js";

import { Layout } from "./components/Layout.jsx";
import { Instructions } from "./components/Instructions.jsx";
import { Homepage } from "./pages/Homepage.jsx";
import { LeaderboardPage } from "./pages/LeaderboardPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { LoginForm } from "./components/LoginForm.jsx";

export const App = () => {
    const [user, set_user] = useState({});
    // const [routes, set_routes] = useState([]);


    return (
        <Routes>
            <Route element={ <Layout /> }>
                <Route path="/" element={ <Homepage/> }/>
                <Route path="/login" element={ <LoginForm/> }/>
                <Route path="/games/leaderboard" element={ <LeaderboardPage/> }/>

                <Route path="*" element={ <NotFoundPage/> }/>

            </Route>

        </Routes>
    )
}
