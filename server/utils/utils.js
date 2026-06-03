const NETWORK_DELAY = 500;

export const calculate_timeshift_seconds = (start_time, actual_time) => {
    return (actual_time.diff(start_time) - NETWORK_DELAY) / 1000;
}


export const validate_start_end_stations = (path, start_station_id, end_station_id) => {
    const len = path.length;
    return path[0] === start_station_id && path[len-1] === end_station_id;
}


const exists_single_step_in_routes = (all_routes, start_step, next_step) => {
    const start_stations = all_routes.filter((route) => route.station_id === start_step); // tutte le linee che hanno station_id == start_step
    const next_stations = all_routes.filter((route) => route.station_id === next_step); // idem qua come sopra ma con next

    for (const start of start_stations){
        for(const next of next_stations){
            if(start.line_name === next.line_name){
                const distance = Math.abs(start.stop_sequence - next.stop_sequence);
                if(distance === 1) // se si allora è di interscambio
                    return true;
            }
        }
    }
    return false;
}


export const validate_route_selected = (all_routes, path) => {
    for (let i = 1; i < path.length; i++){
        const is_valid_step = exists_single_step_in_routes(all_routes, path[i-1], path[i]);
        if (!is_valid_step)
            return false
    }
    return true;
}


export const get_n_random_events = (all_events, number_of_random_events) => {
    const selected_events = [];
    
    for (let i=0; i<number_of_random_events; i++){
        const random_index = Math.floor(Math.random()*all_events.length);
        selected_events.push(all_events[random_index]);
    }

    return selected_events;
}


export const calculate_final_coins = (selected_events) => {
    const initial_value = 0;
    const final_coins = selected_events.reduce((accumulator, current_value) => accumulator + current_value.effect, initial_value);
    
    return final_coins;
}
