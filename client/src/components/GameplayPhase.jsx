import { useEffect, useState } from "react"
import { Button, Container, Stack } from "react-bootstrap";

export const GameplayPhase = (props) => {
    const [coins, set_coins] = useState(20);
    const [current_step, set_current_step] = useState(0);

    const current_route_id = props.current_path[current_step];
    const route_data = props.all_routes?.find(r => r.route_id === current_route_id);
    const current_event = props.game_results?.events[current_step];

    useEffect(() => {
        if (!current_event) return;

        const timer = setTimeout(() => {
            const effect_value = current_event.effect;
            set_coins((prev_coins) => prev_coins + effect_value);

            if (current_step < props.current_path.length) {
                set_current_step(prev_step => prev_step + 1);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [current_step, current_event]);


    return (<>
        <Stack direction="vertical" gap={5} className="align-items-center">
            <p className="fs-4">MONETE ATTUALI: <strong className="text-warning">{coins}</strong></p>

            <Container fluid className="p-4 border rounded bg-dark text-white text-center">
                <h4 className="text-info mb-3">
                    {route_data?.from_station_name} -- {route_data?.to_station_name}
                </h4>
                <p className="text-secondary small">Linea: {route_data?.line_name}</p>

                <hr className="bg-light" />

                {current_event && (
                    <>
                        <h5 className="text-warning">Evento:</h5>
                        <p className="fs-5">{current_event.description}</p>
                        <p className="fw-bold fs-5 text-info">
                            Effetto: {current_event.effect > 0 ? `+${current_event.effect}` : current_event.effect} monete
                        </p>
                    </>
                )}
            </Container>

            <Button className="btn btn-warning" disabled={current_event} onClick={() => props.set_current_phase(props.phases.RESULTS)}>Vai ai risultati</Button>
        </Stack>

    </>)
}