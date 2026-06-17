import { Button } from "react-bootstrap";


/**
 * [Renders the remaining coins of the user when the game is finished or an error if any.]
 * @param {Object} props 
 * @returns the results of the game just ended.
 */
export const ResultsPhase = (props) => {

    const handle_new_game_click = () => {
        props.set_current_phase(props.phases.SETUP);
        props.handle_reset_game();
    }

    return (
        <>
            <div className="text-center mt-5 text-white">
                {props.error_feedback ? (
                    <>
                        <h3 className="text-danger fw-bold">Percorso non valido</h3>
                        <p className="fs-5 bg-dark p-3 rounded border border-danger d-inline-block">
                            {props.error_feedback}
                        </p>
                        <p className="fs-4 text-warning mt-2">
                            Punteggio Totale: <strong>{props.game_results?.final_coins || 0} monete</strong>
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="text-success fw-bold">RISULTATI VIAGGIO</h3>
                        <p className="fs-4">
                            Monete totali: <strong>{props.game_results?.final_coins}</strong>
                        </p>
                    </>
                )}

                <Button
                    className="btn btn-warning btn-lg"
                    onClick={handle_new_game_click}
                >
                    Nuova Partita
                </Button>
            </div>
        </>
    )
}