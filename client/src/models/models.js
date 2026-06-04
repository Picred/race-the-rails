export function SingleRoute(prev_station_id, next_station_id, line_name, is_selected = false) {
    this.prev_station_id = prev_station_id;
    this.next_station_id = next_station_id;
    this.line_name = line_name;
    this.is_selected = is_selected;
}