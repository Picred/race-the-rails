import { useContext } from "react";
import { ListGroup, Stack, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";

import { UserContext } from "../context/UserContext.js";
import { Instructions } from "./Instructions.jsx";
import { USER_API } from "../API/user_api.js";


/**
 * [Renders a sidebar with Rules, Leaderboard and Logout(if logged in) buttons.]
 * @returns a rendered sidebar.
 */
export const Sidebar = () => {
    const navigate = useNavigate();
    const { user, set_user } = useContext(UserContext);

    const handle_logout = (e) => {
        e.preventDefault();
        USER_API.logout();
        set_user("");
        navigate("/");
    };

    return (
        <ListGroup variant="flush" className="vh-100 border-end border-secondary bg-dark text-white">

            <ListGroup.Item className="bg-body text-body border-secondary pt-4 text-center">
                <Stack direction="horizontal" gap={1} className="justify-content-center align-items-center text-center">
                    <RailroadSign />
                    <p className="text-uppercase fs-3 fw-bold">Ultima Corsa</p>
                    <RailroadSign />
                </Stack>

            </ListGroup.Item>

            <ListGroup.Item className="bg-body text-body border-secondary fw-bold">
                <Instructions />
            </ListGroup.Item>

            {user ?
                <ListGroup.Item className="bg-body text-body border-secondary fw-bold">
                    <Button className="btn-danger w-100 fs-5 fw-bold fst-italic p-2 m-1" onClick={() => navigate("/leaderboard")}>Classifica generale</Button>

                    <Stack direction="horizontal" gap={2} className="align-items-end justify-content-center">
                        <Link onClick={(e) => handle_logout(e)}><LogoutIcon /></Link>
                        <p className="text-body fw-bold text-break" variant="outline-info">{user.username}</p>
                    </Stack>
                </ListGroup.Item>
                :

                <ListGroup.Item className="bg-body text-body border-secondary fw-bold disabled">
                    <span className="btn btn-danger disabled w-100 fs-5 fw-bold fst-italic p-2 m-1">
                        Classifica generale
                        <UserLockedIcon />
                    </span>

                </ListGroup.Item>
            }


        </ListGroup>
    );
}

/**
 * [Renders a Railroad icon]
 * @returns a railroad icon
 */
const RailroadSign = () => {
    return (
        <i className="bi bi-sign-railroad fs-1 text-warning"></i>
    );
}

/**
 * [Renders a UserLocked icon]
 * @returns a UserLocked icon
 */
const UserLockedIcon = () => {
    return (
        <i className="bi bi-person-lock"></i>
    );
}

/**
 * [Renders a Logout icon]
 * @returns a Logout icon
 */
const LogoutIcon = () => {
    return (
        <i className="bi bi-box-arrow-left text-warning fs-1 mt-2"></i>
    );
}