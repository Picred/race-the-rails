import { useEffect } from "react"
import { Container, Button, Stack, Image } from "react-bootstrap";
import { GAME_API } from "../API/game_api";
import { get_station_name_by_id } from "../utils/utils.js";

export const PlanningPhase = (props) => {

    useEffect(() => {
        const interval_handle = setInterval(() => {
            props.set_timer((old_timer) => {
                if (old_timer <= 1) {
                    clearInterval(interval_handle);

                    // invio percorso al server. risposta positiva? "gameplay" altrimenti "results" e game fallito.
                    // props.set_current_phase(props.phases.GAMEPLAY); // comment per debug
                    return 0;
                }
                return old_timer - 1;
            });
        }, 1000);

        return () => clearInterval(interval_handle);
    }, []);

    const random_start_station = get_station_name_by_id(props.all_stations, props.random_start_station_id);
    const random_end_station = get_station_name_by_id(props.all_stations, props.random_end_station_id);


    const handle_path_selection = (route_id) => {

        // if (props.current_path?.some(r => r.route_id === station_id)) return;
        if (props.current_path?.includes(route_id)) return;
        props.set_current_path((prev_path) => [...prev_path, route_id]);
    }

    const handle_reset_path = () => {

    }

    return (
        <>
            <Stack direction="vertical" gap={2} className="align-items-center">
                <h3 className="fw-bold text-warning">Fase di Pianificazione</h3>
                <Image src="/routes_no_lines.svg" className="border" fluid />

                <Stack direction="horizontal" gap={2} className="px-3 m-2 align-items-center justify-content-between border">
                    <p className="fs-3 fw-bold text-danger">PARTENZA: {random_start_station?.station_name || "Caricamento..."}</p>
                    <p className="fs-3 fw-bold text-warning">TEMPO RIMANENTE: {props.timer}</p>
                    <p className="fs-3 fw-bold text-danger">ARRIVO: {random_end_station?.station_name || "Caricamento..."}</p>
                </Stack>

                <Container fluid className="fs-5 fw-bold text-warning my-2">
                    PERCORSO SELEZIONATO:{" "}
                    {props.current_path && props.current_path.length > 0 ? (
                        props.current_path.map((route_id, index) => {
                            // Troviamo la tratta per sapere quali stazioni unisce
                            const route = props.all_routes?.find(r => r.route_id === route_id);
                            return (
                                <span className="border mx-2 wrap" key={route_id}>
                                    {route ? `${route.from_station_name}—${route.to_station_name}` : route_id}
                                    {index < props.current_path.length - 1 ? " ➔ " : ""}
                                </span>
                            );
                        })
                    ) : (
                        <span className="text-muted fs-6 fw-normal">Nessuna tratta selezionata</span>
                    )}
                </Container>



                <Stack direction="horizontal" className="flex-wrap gap-2 justify-content-center p-3 border rounded bg-dark">
                    {
                        props.all_routes?.map((route) => {
                            const is_selected = props.current_path?.includes(route.route_id);

                            return (
                                <Button
                                    key={route.route_id}
                                    variant="outline-info"
                                    className="fw-bold"
                                    disabled={is_selected}
                                    onClick={() => handle_path_selection(route.route_id)}
                                >
                                    {route.from_station_name} - {route.to_station_name}
                                </Button>
                            )
                        })
                    }  
                </Stack>

                <Button className="btn btn-danger" onClick={() => props.set_current_path([])}>Ricomincia</Button>
            </Stack>
        </>
    )

}