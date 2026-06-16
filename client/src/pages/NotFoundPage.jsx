import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router";

/**
 * [Renders a visible 404 error if any.]
 * @returns the 404 Not Found error if the selected URL isn't mapped on the client.
 */
export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Stack direction="vertical" className="h-100 justify-content-center align-items-center fw-bold" gap={3}>
            <p className="display-3 text-body fw-bold">404</p>
            <h3 className="text-body fw-bold">Pagina richiesta non trovata</h3>
            
            <Button className="btn btn-danger btn-lg fs-5 fw-bold fst-italic p-3" onClick={() => navigate("/")}>
                <HomeIcon />
            </Button>
        </Stack>
    )
}

const HomeIcon = () => {
    return (
        <i className="bi bi-house-door-fill"></i>
    );
}