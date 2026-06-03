import { useEffect, useState } from "react";
import { SetupPhase } from "../components/SetupPhase.jsx";
import { PlanningPhase } from "../components/PlanningPhase.jsx";
import { GameplayPhase } from "../components/GameplayPhase.jsx";
import { ResultsPhase } from "../components/ResultsPhase.jsx";


const PHASES = {
    SETUP: "SETUP",
    PLANNING: "PLANNING",
    GAMEPLAY: "GAMEPLAY",
    RESULTS: "RESULTS",
}


export const GameplayPage = (props) => {
    const [current_phase, set_current_phase] = useState(PHASES.SETUP);
    const [timer, set_timer] = useState();
    const [routes, set_routes] = useState(undefined);

    useEffect(() => {
        
    }, [])


    return <>
        {current_phase === PHASES.SETUP && <SetupPhase />}
        {current_phase === PHASES.PLANNING && <PlanningPhase />}
        {current_phase === PHASES.GAMEPLAY && <GameplayPhase />}
        {current_phase === PHASES.RESULTS && <ResultsPhase />}
    </>
}