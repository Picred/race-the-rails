import { Stack, Image, Button } from "react-bootstrap"
import { GAME_API } from "../API/game_api.js"

/**
 * [Renders the map and the start button of the game.]
 * @param {Object} props 
 * @returns the map of the game and a Button to start it.
 */
export const SetupPhase = (props) => {

    const handle_button_click = async () => {
        props.set_current_phase(props.phases.PLANNING)

        const game_data = await GAME_API.create_new_game();
        props.set_random_start_station_id(game_data.random_start_station_id);
        props.set_random_end_station_id(game_data.random_end_station_id);
        props.set_game_id(game_data.game_id);
    }

    return (
        <Stack direction="vertical" gap={2} className="align-items-center">
            <h3 className="fw-bold text-warning">Fase di Setup</h3>
            <Image src="/routes_lines.svg" className="border" fluid/>
            <Button className="btn btn-warning" onClick={handle_button_click}>Sono pronto!</Button>
        </Stack>
    )
}