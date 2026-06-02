const BASE_URL = "http://localhost:3001";


// login
const login = async (credentials) => {
    try {

        const response = await fetch(BASE_URL + "/api/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(credentials),
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        }
        else {
            const error_message = response.headers.get("WWW-Authenticate");
            throw error_message;
        }
    }catch (err){
        console.log(err);
    }
}


//logout
const logout = async () => {

}



export const USER_API = { login };