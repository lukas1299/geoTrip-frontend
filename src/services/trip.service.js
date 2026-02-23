import axios from "axios";
const GATEWAY_URL = "http://localhost:8080/api/v1/trips";

const getUserTrips = async () => {
    const token = localStorage.getItem("access_token");
    
    const response = await axios.get(GATEWAY_URL, {
      headers: { 
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
}

const tripService = {
    getUserTrips
}

export default tripService;