import { Form, Button, Stack, Card, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.js"

export const LoginForm = () => {
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const { set_user } = useContext(UserContext);

    const [is_loading, set_is_loading] = useState(false);

    const handlesubmit = (event) => {
        event.preventDefault();

        set_is_loading(true);


        // set_user({server_repsonse.user_id, server_repsonse.username})
        // set_routes(server_repsonse)

        //navigate("");

        // set_is_loading(false);
    }


    return (
        <Stack direction="vercital" className="h-100 justify-content-center align-items-center bg-dark">
            <Card className="p-5">
                <Card.Body>
                    <h3 className="text-center fw-bold">Login!</h3>
                    <p>Inserisci le tue credenziali per sbloccare il gioco intero!</p>

                    <Form onSubmit={(e) => handlesubmit(e)}>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                minLength={2}
                                maxLength={20}
                                placeholder="Inserisci username"
                                value={username}
                                onChange={event => set_username(event.target.value)}
                                required />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                minLength={2}
                                maxLength={20}
                                placeholder="Inserisci Password"
                                value={password}
                                onChange={event => set_password(event.target.value)}
                                required />
                        </Form.Group>

                        <Stack direction="horizontal" className="justify-content-center">
                            {!is_loading
                                ?
                                <Button className="btn-md btn-success" type="submit">Login</Button>
                                :
                                <Button className="btn-md btn-success disabled" type="submit">
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="px-2">Invio in corso...</span>
                                </Button>
                            }
                        </Stack>

                    </Form>
                </Card.Body>
            </Card>
        </Stack >
    );
}