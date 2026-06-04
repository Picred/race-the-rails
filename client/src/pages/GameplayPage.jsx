import { useEffect, useState } from "react";
import { SetupPhase } from "../components/SetupPhase.jsx";
import { PlanningPhase } from "../components/PlanningPhase.jsx";
import { GameplayPhase } from "../components/GameplayPhase.jsx";
import { ResultsPhase } from "../components/ResultsPhase.jsx";

import { GAME_API } from "../API/game_api.js";

const PHASES = {
    SETUP: "SETUP",
    PLANNING: "PLANNING",
    GAMEPLAY: "GAMEPLAY",
    RESULTS: "RESULTS",
}


export const GameplayPage = (props) => {
    const [current_phase, set_current_phase] = useState("");
    const [current_path, set_current_path] = useState([]);
    const [timer, set_timer] = useState(90);

    const [random_start_station_id, set_random_start_station_id] = useState();
    const [random_end_station_id, set_random_end_station_id] = useState();

    const [all_routes, set_all_routes] = useState(undefined);
    const [all_stations, set_all_stations] = useState();



    useEffect(() => {
        set_current_phase(PHASES.SETUP);
    }, []); // [] solo una volta!

    useEffect(() => {
        if (current_phase !== PHASES.SETUP) return;

        const get_all_routes = async () => {
            const all_routes_data = await GAME_API.list_routes();
            if (all_routes_data.error) return;

            set_all_routes(all_routes_data);
        }

        const get_all_stations = async () => {
            const stations = await GAME_API.list_stations();
            set_all_stations(stations);
        }
        get_all_routes();
        get_all_stations();
    }, [current_phase])



    return <>
        {current_phase === PHASES.SETUP &&
            <SetupPhase
                set_current_phase={set_current_phase}
                phases={PHASES}
                set_random_start_station_id={set_random_start_station_id}
                set_random_end_station_id={set_random_end_station_id}
            />}

        {current_phase === PHASES.PLANNING &&
            <PlanningPhase timer={timer}
                set_timer={set_timer}
                all_routes={all_routes}
                random_start_station_id={random_start_station_id}
                random_end_station_id={random_end_station_id}
                all_stations={all_stations}
                set_current_path={set_current_path}
                set_current_phase={set_current_phase}
                current_path={current_path}
                phases={PHASES}
            />}

        {current_phase === PHASES.GAMEPLAY && <GameplayPhase />}
        {current_phase === PHASES.RESULTS && <ResultsPhase />}
    </>
}