export const get_station_name_by_id = (all_stations, id) => {
    return all_stations?.find((station) => station.station_id === id)
}