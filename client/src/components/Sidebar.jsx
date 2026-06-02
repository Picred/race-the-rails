import { useState } from "react";
import { ButtonGroup, Col, Row, ToggleButton, ListGroup, Stack, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { Instructions } from "./Instructions.jsx";


export const Sidebar = (props) => {
    const navigate = useNavigate();


    return (
        <ListGroup variant="flush" className="vh-100 border-end border-secondary bg-dark text-white">

            <ListGroup.Item className="bg-body text-body border-secondary pt-4 text-center" action onClick={() => navigate("/")}>
                <Stack direction="horizontal" gap={1} className="justify-content-center align-items-center text-center">
                    <RailroadSign />
                    <p className="text-uppercase fs-3 fw-bold">Ultima Corsa</p>
                    <RailroadSign />
                </Stack>
            </ListGroup.Item>

            <ListGroup.Item className="bg-body text-body border-secondary fw-bold">
                <Instructions />
            </ListGroup.Item>

            {false ?
                <ListGroup.Item className="bg-body text-body border-secondary fw-bold" action onClick={() => navigate("/games/leaderboard")}>
                    <span className="btn btn-danger w-100 fs-5 fw-bold fst-italic p-2 m-1">Classifica generale</span>
                </ListGroup.Item> :

                <ListGroup.Item className="bg-body text-body border-secondary fw-bold disabled" action onClick={() => navigate("/games/leaderboard")}>
                    <span className="btn btn-danger disabled w-100 fs-5 fw-bold fst-italic p-2 m-1">
                        Classifica generale
                        <KeyIcon />
                    </span>

                </ListGroup.Item>
            }


        </ListGroup>
    );
}


const RailroadSign = () => {
    return (
        <i className="bi bi-sign-railroad fs-1 text-warning"></i>
    );
}

const KeyIcon = () => {
    return (
        <i className="bi bi-person-lock"></i>
    );
}