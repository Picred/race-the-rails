/**
 * 
 * @param {Number} prev_station_id 
 * @param {Number} next_station_id 
 * @param {string} line_name 
 */


export function SingleRoute(prev_station_id, next_station_id, line_name) {
    this.prev_station_id = prev_station_id;
    this.next_station_id = next_station_id;
    this.line_name = line_name;
}