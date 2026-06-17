import { useState } from "react";
import { Button, Modal, ListGroup, Stack } from "react-bootstrap";


/**
 * [Renders the rules of the game]
 * @returns a Modal component with the rules of the game.
 */
export const Instructions = () => {
    const [show_instrutions, set_show_instructions] = useState(false);

    const handle_close_instructions = () => set_show_instructions(false);
    const handle_show_instructions = () => set_show_instructions(true);

    return (
        <>
            <Button className="btn btn-warning w-100 fs-5 fw-bold fst-italic p-2 m-1" onClick={handle_show_instructions}>
                Regole del gioco
            </Button>

            <Modal show={show_instrutions} onHide={handle_close_instructions}>
                <Modal.Header closeButton>
                    <Modal.Title>Regole del gioco</Modal.Title>
                </Modal.Header>


                <Modal.Body>
                    <ListGroup>
                        <ListGroup.Item>
                            <span className="fw-bold text-warning">Obiettivo</span>
                            <span>
                                : Raggiungere la destinazione con più monete possibili partendo da 20. Il gioco si divide in varie fasi:
                            </span>
                        </ListGroup.Item>


                        <ListGroup.Item>
                            <span className="fw-bold text-danger">1. Setup</span>
                            <span>
                                : Studia le linee nella mappa e le loro connessioni prima di partire.
                            </span>
                        </ListGroup.Item>


                        <ListGroup.Item>
                            <span className="fw-bold text-warning">2. Pianificazione</span>
                            <span>
                                : Ricevi due stazioni (partenza e arrivo) casuali distanti almeno 3 tratte tra loro.
                            </span>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-danger">3. Timer</span>
                            <span>
                                : Hai 90 secondi per costruire la migliore tratta in sequenza. Se il tempo scade, il percorso si invia automaticamente.
                            </span>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-warning">4. Vincoli</span>
                            <span>
                                : Puoi cambiare linea solo nelle stazioni di interscambio. Ogni tratta è monouso.
                            </span>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-danger">5. Viaggio</span>
                            <span>
                                : Se il percorso pianificato è valido, ogni tappa attiva un evento casuale da <span className="fw-bold text-danger">-4 a +4 monete</span>. Se è errato, totalizzi <span className="fw-bold text-danger">0</span>.
                            </span>
                        </ListGroup.Item>
                    </ListGroup>
                </Modal.Body>


                <Modal.Footer className="d-block">
                    <Stack direction="horizontal" className="justify-content-center">
                        <Button variant="danger" onClick={handle_close_instructions}>
                            Chiudi
                        </Button>
                    </Stack>
                </Modal.Footer>
            </Modal>
        </>
    );
}
