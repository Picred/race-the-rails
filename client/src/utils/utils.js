/**
 * [Get the station name by its id, if present.]
 * @param {Array} all_stations 
 * @param {Number} id 
 * @returns the name of the station if it exists in the array object.
 */
export const get_station_name_by_id = (all_stations, id) => {
    return all_stations?.find((station) => station.station_id === id)
}