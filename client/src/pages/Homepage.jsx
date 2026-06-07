import { Button, Container, Stack } from "react-bootstrap";
import { Link } from "react-router";
import { useContext, useEffect } from "react";
import { Instructions } from "../components/Instructions.jsx";
import { UserContext } from "../context/UserContext.js";
import { GameplayPage } from "./GameplayPage.jsx";

/**
 * [Renders the Homepage of the application with the name and the Button for logging in or the Gameplay Page if logged in]
 * @param {Object} props 
 * @returns 
 */
export const Homepage = (props) => {
    const { user } = useContext(UserContext);


    return (
        <>
            {!user &&
                <Stack direction="vertical" className="h-100 w-100 justify-content-center align-items-center" gap={4} >
                    <h1 className="display-3 text-body fw-bold">
                        <TrainIcon />
                        Ultima Corsa
                    </h1>

                    <Stack direction="horizontal" gap={2} className="justify-content-center">
                        <Link to="/login" className="btn btn-danger btn-lg fs-5 fw-bold fst-italic p-3">
                            <PersonIcon />
                            Login
                        </Link>
                    </Stack>
                </Stack>
            }
        </>
    );
}


/**
 * [Renders a Train icon]
 * @returns a Train icon
 */
export const TrainIcon = () => {
    return <i className="bi bi-train-front me-3 text-danger"></i>;
}

/**
 * [Renders a Person icon]
 * @returns a Person icon
 */
export const PersonIcon = () => {
    return <i className="bi bi-person-circle p-2 m-0"></i>;
}