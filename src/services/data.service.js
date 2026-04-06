
import axios from "axios";

const API_URL = `http://localhost:8080/api/v1/data`;
                 

const token = localStorage.getItem("access_token");

const loadData = async () => {

    const response = await axios.get(API_URL + "/loadUserData", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
};


const dataService = {
    loadData
}

export default dataService;