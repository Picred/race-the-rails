const BASE_URL = "http://localhost:3001/api";


/**
 * [Log in the user]
 * @param {{username: string, password: string}} credentials 
 * @returns the username of the user.
 */
const login = async (credentials) => {
    try {
        const response = await fetch(`${BASE_URL}/sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
        if (response.ok) {
            const user_data = await response.json();
            return user_data;
        }
        else {
            const error_message = response.headers.get("WWW-Authenticate");
            return { error: error_message };

        }
    } catch {
        return { error: "Errore di connessione con il server" };

    }
}


/**
 * [Log out from the account]
 */
const logout = async () => {
    await fetch(`${BASE_URL}/sessions/current`, {
        method: "DELETE",
        credentials: "include"
    });
}



export const USER_API = { login, logout };
