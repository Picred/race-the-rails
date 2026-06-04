import { Stack, Image, Button } from "react-bootstrap"

export const SetupPhase = () => {


    return (
    <Stack direction="vertical" gap={2} className="align-items-center">
        <h3 className="fw-bold text-warning">Fase di Setup</h3>
        <Image src="/routes_lines.svg" className="border" fluid />
        <Button className="btn btn-warning">Sono pronto!</Button>
    </Stack>
    )
}