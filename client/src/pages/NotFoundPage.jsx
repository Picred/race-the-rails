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
        <h1>404 Not Found</h1>
        <Button className="btn btn-warning fs-5" onClick={() => navigate("/")}>
            <HomeIcon/>
        </Button>
        </Stack>
    )
}

const HomeIcon = () => {
    return (
        <i className="bi bi-house-door-fill"></i>
    );
}