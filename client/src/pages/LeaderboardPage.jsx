import { useState, useEffect } from "react";
import { GAME_API } from "../API/game_api.js";
import { Stack } from "react-bootstrap";

export const LeaderboardPage = () => {
    const [error_feedback, set_error_feedback] = useState();
    const [leaderboard_entries, set_leaderboard_entries] = useState([]);
    useEffect(() => {
        const get_leaderboard = async () => {
            const response = await GAME_API.get_leaderboard();

            if (response.message) { // errore
                set_error_feedback(response.message);
            }
            else {
                set_leaderboard_entries(response.entries);
            }
        }
        get_leaderboard();
        // if (error_feedback) console.log(error_feedback);
        // if (leaderboard_entries) console.log(leaderboard_entries);
    }, [])

    return (<>
        <Stack direction="vertical" className="align-items-center">
            <p className="border fs-4 mt-2">{error_feedback ? "E' avvenuto un errore" : "LEADERBOARD"}</p>
            {leaderboard_entries && leaderboard_entries.map((entry, index) => {
                return (
                    <p key={entry.game_id}>
                        {index + 1}: {entry.username} - {entry.score} monete
                    </p>
                )
            })}
        </Stack>

    </>
    );
}