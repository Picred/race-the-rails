function LineStation(line_station_id = null, line_name, station_id, stop_sequence){
    this.line_station_id = line_station_id,
    this.line_name = line_name,
    this.station_id = station_id,
    this.stop_sequence = stop_sequence
};

export { LineStation };

function Route(){};

function Event(){};

function Station(){};