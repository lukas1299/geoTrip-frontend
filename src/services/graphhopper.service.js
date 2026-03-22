
import axios from "axios";

const API_URL = `http://localhost:8080/api/v1/trips`;
                 

const token = localStorage.getItem("access_token");

const loadExapleTrip = async (firstPoint, lastPoint, range) => {

    const response = await axios.post(API_URL + "/loadExampleTrip", {
        "points": [
            [
                firstPoint[1], firstPoint[0]
            ],
            [
                lastPoint[1], lastPoint[0]
            ]
        ], 
        "range":range,
        
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
};

const loadTripBetweenPoints = async (firstPoint, lastPoint, range) => {
    const response = await axios.post(API_URL + "/calculate-between-points", {
        "points": [
            [
                firstPoint[1], firstPoint[0]
            ],
            [
                lastPoint[1], lastPoint[0]
            ]
        ], 
        "range":range,
        
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
};

const graphhopperService = {
    loadExapleTrip,
    loadTripBetweenPoints
}

export default graphhopperService;