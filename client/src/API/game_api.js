const BASE_URL = "http://localhost:3001";



const list_routes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/routes`, {
            credentials: "include"
        }); // TODO: includere cookie / credentials: true

        if (response.ok) {
            const routes = await response.json();
            return routes;
        }
        else{
            return {error: "Rotte assenti"};
        }
    } catch (err) {
        return ({error: "Errore di connessione con il server"});
    }
}


export const GAME_API = { list_routes };