import { useState, useEffect } from "react";
import { GAME_API } from "../API/game_api.js";
import { Button, Stack, Table } from "react-bootstrap";
import { useNavigate } from "react-router";

/**
 * [Renders a table of best scores totalized in the past.]
 * @returns a table containing the leaderboard of the game per user.
 */
export const LeaderboardPage = () => {
    const [error_feedback, set_error_feedback] = useState();
    const [leaderboard_entries, set_leaderboard_entries] = useState([]);

    const navigate = useNavigate();

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
    }, [])

    return (<>
        <Stack direction="vertical" className="align-items-center justify-content-center h-100" gap={5}>
            <p className="border display-4 mt-2 p-4 rounded bg-dark fw-bold">{error_feedback ? "E' avvenuto un errore" : "Classifica Generale"}</p>

            {!error_feedback &&
                <Table striped bordered hover responsive className="fs-5 text-center">
                    <thead>
                        <tr>
                            <th>Pos.</th>
                            <th>Username</th>
                            <th>Puteggio migliore</th>
                        </tr>
                    </thead>
                    <tbody>

                        {leaderboard_entries && leaderboard_entries.map((entry, index) => {
                            return (
                                <tr key={entry.game_id}>
                                    <td>{index + 1}</td>
                                    <td>{entry.username}</td>
                                    <td>{entry.score} monete </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            }

        <Button className="btn btn-warning" onClick={() => navigate("/")}>Torna alla home!</Button>

            
        </Stack>
    </>
    );
}