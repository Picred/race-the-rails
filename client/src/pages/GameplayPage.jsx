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
    const [current_phase, set_current_phase] = useState(PHASES.SETUP);
    const [timer, set_timer] = useState();
    const [routes_pairs, set_routes_pairs] = useState(undefined);

    useEffect(() => {
        const get_all_routes = async () => {
            const all_routes_data = await GAME_API.list_routes();
            if (all_routes_data.error) return;

            // get a list of route pairs 
            // [
            //     {prev: 1, next:2, line_name="Linea Rossa", is_slected:fakse},
            //     {prev: 2, next:3, line_name="Linea Rossa", is_slected:fakse},
            //     {prev: 3, next:4, line_name="Linea Rossa", is_slected:fakse},
            //     {prev: 1, next:2, line_name="Linea Rossa", is_slected:fakse},
            // ]
            set_routes_pairs(all_routes_data);
            // all_routes_data.map(route => console.log(route));

        }
        get_all_routes();

    }, [])


    return <>
        {current_phase === PHASES.SETUP && <SetupPhase />}
        {current_phase === PHASES.PLANNING && <PlanningPhase />}
        {current_phase === PHASES.GAMEPLAY && <GameplayPhase />}
        {current_phase === PHASES.RESULTS && <ResultsPhase />}
    </>
}