import axios from "axios";
const GATEWAY_URL = "http://localhost:9090/realms/realm_geo/protocol/openid-connect/token";


const login = async (username, password) => {
     const params = new URLSearchParams();
        params.append("client_id", "geo");
        params.append("grant_type", "password");
        params.append("username", username);
        params.append("password", password);
    const response = await axios.post(GATEWAY_URL, params, {
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    localStorage.setItem("access_token", response.data.access_token);
    return response.data;
}

const authService = {
    login
}

export default authService;