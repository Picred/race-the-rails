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
    const [current_path, set_current_path] = useState([]); // ["Linea Arancione 3-7"]
    const [timer, set_timer] = useState(90);

    const [game_id, set_game_id] = useState();
    const [game_results, set_game_results] = useState();

    const [error_feedback, set_error_feedback] = useState();

    const [random_start_station_id, set_random_start_station_id] = useState();
    const [random_end_station_id, set_random_end_station_id] = useState();

    const [all_routes, set_all_routes] = useState(undefined);
    const [all_stations, set_all_stations] = useState();



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


        set_timer(90);
        set_game_id(undefined);
        set_error_feedback("");
        set_random_end_station_id(undefined);
        set_random_start_station_id(undefined);
        set_current_path([]);
    }, [current_phase])



    const handle_send_current_path = async () => {
        // if (!current_path || current_path.length === 0) {
        //     set_error_feedback("Nessuna tratta selezionata. Il viaggio è incompleto.");
        //     set_game_results({ final_coins: 0, events: [] }); // totale finale 0
        //     set_current_phase(PHASES.RESULTS);
        //     return;
        // }

        const selected_path_ids = []
        for (let i = 0; i < current_path.length; i++) {
            // prendo le info sulla route
            const route_data = all_routes.find(route => route.route_id === current_path[i]);

            if (route_data) //lultima stazione è la to_station_id nella route trovata.
                selected_path_ids.push(route_data.from_station_id);

            if (i === current_path.length - 1)
                selected_path_ids.push(route_data.to_station_id);
        }

        // invio, anche vuoto se tempo scaduto
        const response = await GAME_API.send_current_path(selected_path_ids, game_id);

        if (response.message) { // non valido
            set_error_feedback(response.message);
            set_game_results({ final_coins: 0, events: [] });
            set_current_phase(PHASES.RESULTS)
        }
        else {
            // percorso valido
            set_game_results(response);
            set_current_phase(PHASES.GAMEPLAY)
        }

    }

    return (
        <>
            {current_phase === PHASES.SETUP &&
                <SetupPhase
                    set_game_id={set_game_id}
                    set_current_phase={set_current_phase}
                    phases={PHASES}
                    set_random_start_station_id={set_random_start_station_id}
                    set_random_end_station_id={set_random_end_station_id}
                />
            }

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
                    handle_send_current_path={handle_send_current_path}
                />
            }

            {current_phase === PHASES.GAMEPLAY &&
                <GameplayPhase game_results={game_results}
                    set_current_phase={set_current_phase}
                    current_path={current_path}
                    all_routes={all_routes}
                    set_current_phase={set_current_phase}


                />
            }

            {current_phase === PHASES.RESULTS &&
                <ResultsPhase error_feedback={error_feedback}
                    game_results={game_results}
                    phases={PHASES}
                    set_current_phase={set_current_phase}
                />
            }
        </>
    )
}