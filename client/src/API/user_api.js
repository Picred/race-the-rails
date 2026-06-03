const BASE_URL = "http://localhost:3001/api";


// login
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
            return {error: error_message};

        }
    }catch (err){
        return {error: err};

    }
}


//logout
const logout = async () => {

}



export const USER_API = { login };