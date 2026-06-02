// import './App.css'
import { useEffect, useState } from "react";

import { GAME_API } from "./API/game_api.js";
import { USER_API } from "./API/user_api.js";

export const App = () => {
  const [user, set_user] = useState({});
  const [routes, set_routes] = useState([]);

  useEffect(() => {
    const login = async () => {
      
      try{
        const login_result = await USER_API.login({username: "andrei", password: "andreipsws"});
        set_user(login_result.user);
        
        set_routes(login_result.routes);
      }catch(err){
        console.log(err);
      }
    }

    login();
  }, []);

  return <p>Lorem ipsum: {routes && routes.map((route => route.line_name))}</p>
}
