import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router";

import { GAME_API } from "./API/game_api.js";
import { USER_API } from "./API/user_api.js";
import { UserContext } from "./context/UserContext.js";

import { Layout } from "./components/Layout.jsx";
import { Instructions } from "./components/Instructions.jsx";
import { Homepage } from "./pages/Homepage.jsx";
import { LeaderboardPage } from "./pages/LeaderboardPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { GameplayPage } from "./pages/GameplayPage.jsx";

/**
 * [Renders all the components of the game.]
 * @returns the core of the game and the implemented routes.
 */
export const App = () => {
    const [user, set_user] = useState(undefined);


    return (
        <UserContext.Provider value={{ user, set_user }}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={!user ? <Homepage /> : <GameplayPage />} />
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate replace to="/" />} />
                    <Route path="/leaderboard" element={user ? <LeaderboardPage /> : <Navigate replace to="/login" />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    );
}
