import { useState } from "react";
import { Button, Modal, ListGroup } from "react-bootstrap";

export const Instructions = (props) => {
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
                            <span className="fw-bold text-warning">Obiettivo</span>: Raggiungere la destinazione con più monete possibili partendo da 20. Il gioco si divide in varie fasi:
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-danger">1. Setup</span>: 
                            Studia le linee nella mappa e le loro connessioni prima di partire.
                        </ListGroup.Item>


                        <ListGroup.Item>
                            <span className="fw-bold text-warning">2. Pianificazione</span>: 
                            Ricevi due stazioni (partenza e arrivo) casuali distanti almeno 3 tratte tra loro.
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-danger">3. Timer (90s)</span>: 
                            Hai 90 secondi per costruire la migliore tratta in sequenza. Se il tempo scade, il percorso si invia automaticamente.
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-warning">4. Vincoli</span>:
                            Puoi cambiare linea solo nelle stazioni di interscambio. 
                            Ogni tratta è monouso.
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <span className="fw-bold text-danger">5. Viaggio</span>: 
                            Se il percorso pianificato è valido, ogni tappa attiva un evento casuale da <span className="fw-bold text-danger">-4 a +4 monete</span>. Se è errato, totalizzi <span className="fw-bold text-danger">0</span>.
                        </ListGroup.Item>
                    </ListGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handle_close_instructions}>
                        Chiudi
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
}
