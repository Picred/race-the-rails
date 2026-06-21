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


/**
 * [Gets all single steps between 2 stations (forward/backward)]
 * @param {[Object]} all_routes 
 * @returns {[Object]} an array containng all the couples of segments between stops.
 */
export const get_single_segments_from_routes = (all_routes) => {
    let computed_segments = [];
    for (let i = 0; i < all_routes.length - 1; i++) {
        const current_stop = all_routes[i];
        const next_stop = all_routes[i + 1];

        //se la fermata successiva fa parte di un'altra linea, skip
        if (current_stop.line_name === next_stop.line_name) {
            computed_segments.push({
                route_id: `${current_stop.line_name}-${current_stop.station_id}-${next_stop.station_id}`,
                line_name: current_stop.line_name,
                from_station_id: current_stop.station_id,
                from_station_name: current_stop.station_name,
                to_station_id: next_stop.station_id,
                to_station_name: next_stop.station_name,
            });

            computed_segments.push({
                route_id: `${current_stop.line_name}-${next_stop.station_id}-${current_stop.station_id}`,
                line_name: current_stop.line_name,
                from_station_id: next_stop.station_id,
                from_station_name: next_stop.station_name,
                to_station_id: current_stop.station_id,
                to_station_name: current_stop.station_name,
            });
        }
    }
    return computed_segments;
}


/**
 * [Calculate all the distances from a starting point]
 * @param {[Object]} all_routes 
 * @param {Object} random_start_route_step 
 * @returns an array containing all the distances from `random_start_route_step` ordered by `station_id`.
 */
const calculate_distances_from_station = (all_routes, random_start_route_step) => {
    const distances = [];
    distances[random_start_route_step.station_id] = 0;

    for (let pace = 0; pace < 5; pace++) {
        for (let r1 of all_routes) {
            for (let r2 of all_routes) {

                // Se r1 e r2 sono sulla stessa linea e sono consecutive (+1 o -1 fermata)
                if (r1.line_name === r2.line_name && Math.abs(r1.stop_sequence - r2.stop_sequence) === 1) {

                    // r1 già calcolata (stessa linea, distanza 1), allora r2 è a distanza r1 + 1
                    if (distances[r1.station_id] !== undefined) {
                        const new_distance = distances[r1.station_id] + 1; // dalla sorgente

                        // Se r2 non ancora scoperta o ho una strada piu corta
                        if (distances[r2.station_id] === undefined || new_distance < distances[r2.station_id]) {
                            distances[r2.station_id] = new_distance;
                        }
                    }
                }
            }
        }
    }
    return distances;
}


/**
 * [Generates a random and valid end route step]
 * @param {[Route]} all_routes 
 * @param {Object} random_start_route_step 
 * @returns a randomly selected end route step.
 */
export const get_random_end_route_step = (all_routes, random_start_route_step) => {
    const distances = calculate_distances_from_station(all_routes, random_start_route_step);

    // distances[0] = undefined sempre, le station_id partono da 1!

    const valid_end_stations = all_routes.filter((route) => {
        const distance = distances[route.station_id];
        return distance !== undefined && distance >= 3;
    });

    let random_index = Math.floor(Math.random() * valid_end_stations.length);

    if (random_index === 0) random_index += 1;
    return valid_end_stations[random_index];
}