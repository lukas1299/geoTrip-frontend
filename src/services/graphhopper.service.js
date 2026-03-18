
import axios from "axios";

const API_URL = `http://localhost:8080/api/v1/trips/loadExampleTrip`;
                 
const token = localStorage.getItem("access_token");

const loadExapleTrip = async (firstPoint, lastPoint) => {

    const response = await axios.post(API_URL, {
        "points": [
            [
                firstPoint[1], firstPoint[0]
            ],
            [
                lastPoint[1], lastPoint[0]
            ]
        ],
        
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

const graphhopperService = {
    loadExapleTrip
}

export default graphhopperService;