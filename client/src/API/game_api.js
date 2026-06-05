const BASE_URL = "http://localhost:3001/api";



const list_routes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/routes`, {
            credentials: "include"
        }); // TODO: includere cookie / credentials: true

        if (response.ok) {
            const routes = await response.json();
            return routes;
        }
        else {
            return { error: "Rotte assenti" };
        }
    } catch (err) {
        return ({ error: "Errore di connessione con il server" });
    }
}



const list_stations = async () => {
    try {
        const response = await fetch(`${BASE_URL}/stations`, {
            credentials: "include"
        });

        if (response.ok) {
            const stations = await response.json();
            return stations;
        }
        else {
            return { error: "Stazioni assenti" };
        }
    } catch (err) {
        return ({ error: "Errore di connessione con il server" });
    }
}

const create_new_game = async () => {
    try {
        const response = await fetch(`${BASE_URL}/games`, {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            const game_data = await response.json();
            return game_data;
        }
        else {
            return { error: "Dati di gioco assenti" };
        }
    } catch (err) {
        return ({ error: "Errore di connessione con il server" });
    }
}

const send_current_path = async (current_path, game_id) => {
    try {
        const response = await fetch(`${BASE_URL}/games/${game_id}/validate`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ path: current_path }),
        });

        if (response.ok) {
            const game_results = await response.json();
            return game_results;
        }
        else {
            const error_data = await response.json();
            return error_data;
        }
    } catch (err) {
        return { error: err };
    }
}

export const GAME_API = { list_routes, list_stations, create_new_game, send_current_path };