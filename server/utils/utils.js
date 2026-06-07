const NETWORK_DELAY = 500;


/**
 * [Calculates the difference between the 2 times.]
 * @param {dayjs} start_time 
 * @param {dayjs} actual_time 
 * @returns the calculated difference.
 */
export const calculate_timeshift_seconds = (start_time, actual_time) => {
    return (actual_time.diff(start_time) - NETWORK_DELAY) / 1000;
}


/**
 * [Check if start/end station ids are the first/last elements in the path array]
 * @param {Array} path 
 * @param {Number} start_station_id 
 * @param {Number} end_station_id 
 * @returns the result of the validation
 */
export const validate_start_end_stations = (path, start_station_id, end_station_id) => {
    const len = path.length;
    return path[0] === start_station_id && path[len-1] === end_station_id;
}


/**
 * [Validate if start and next stations are 1 step distant each other]
 * @param {Array} all_routes 
 * @param {Number} start_step 
 * @param {Number} next_step 
 * @returns the result of the validation if the start and next steps have 1 step of distance.
 */
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


/**
 * [Checks if the path is valid (if there are only single steps between stations in the path)]
 * @param {Array} all_routes 
 * @param {Array} path 
 * @returns the result of the validation if every single step are 1 step distant each other.
 */
export const validate_route_selected = (all_routes, path) => {
    for (let i = 1; i < path.length; i++){
        const is_valid_step = exists_single_step_in_routes(all_routes, path[i-1], path[i]);
        if (!is_valid_step)
            return false
    }
    return true;
}


/**
 * [Generates `number_of_random_events` events ]
 * @param {Array} all_events 
 * @param {Number} number_of_random_events 
 * @returns an Array containing random events.
 */
export const get_n_random_events = (all_events, number_of_random_events) => {
    const selected_events = [];
    
    for (let i=0; i<number_of_random_events; i++){
        const random_index = Math.floor(Math.random()*all_events.length);
        selected_events.push(all_events[random_index]);
    }

    return selected_events;
}


/**
 * [Get the total amount of the effect from the events.]
 * @param {Array} selected_events 
 * @returns the amount of effects from the generated events.
 */
export const calculate_final_coins = (selected_events) => {
    const initial_value = 0;
    const final_coins = selected_events.reduce((accumulator, current_value) => accumulator + current_value.effect, initial_value);
    
    return final_coins;
}
