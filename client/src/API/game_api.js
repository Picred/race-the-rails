const BASE_URL = "http://localhost:3001";



const list_routes = async () => {
    const result = await fetch(`${BASE_URL}/api/routes`);
    const routes = await result.json();

    return routes;
}


export const GAME_API = {list_routes};