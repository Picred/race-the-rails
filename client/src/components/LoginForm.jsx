import { Form, Button, Stack, Card, Spinner } from "react-bootstrap";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext.js"
import { USER_API } from "../API/user_api.js";
import { useNavigate } from "react-router";

export const LoginForm = () => {
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const { set_user } = useContext(UserContext);

    const [is_loading, set_is_loading] = useState(false);
    const [notification, set_notification] = useState("");
    const navigate = useNavigate();


    const handlesubmit = async (event) => {
        event.preventDefault();

        set_is_loading(true);
        set_notification("");

        const user_info = await USER_API.login({ username: username, password: password })
        // login tramite API
        if (user_info.error) {
            set_notification(user_info.error)
        }
        else {
            set_user({ user_id: user_info.user_id, username: user_info.username })
            // set_routes(user_info.routes)
            navigate("/");
        }

        set_username("");
        set_password("");
        set_is_loading(false);
    }


    return (
        <Stack direction="vercital" className="h-100 justify-content-center align-items-center">
            <Card className="p-5">
                <Card.Body>
                    <h3 className="text-center fw-bold">Login!</h3>
                    {notification && <p className="rounded p-1 my-4 border text-center fs-5 text- bg-body-secondary">{notification}!</p>}

                    <p >Inserisci le tue credenziali per sbloccare il gioco intero!</p>

                    <Form onSubmit={(e) => handlesubmit(e)}>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Username/Email</Form.Label>
                            <Form.Control
                                type="email"
                                minLength={4}
                                maxLength={50}
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