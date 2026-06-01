export function Route(line_name, station_id, station_name, stop_sequence) {
    // this.route_id = route_id,
    this.line_name = line_name,
    this.station_id = station_id,
    this.station_name = station_name,
    this.stop_sequence = stop_sequence
};


export function Event(description, effect) {
    this.description = description
    this.effect = effect
};


export function Station(station_name) {
    this.station_name = station_name
};


export function Game(final_coins, events){
    this.final_coins = final_coins,
    this.events = events
};

export function HttpError(error_code, message){
    this.error_code = error_code,
    this.message = message
}