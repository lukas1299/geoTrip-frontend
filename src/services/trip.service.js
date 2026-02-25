import axios from "axios";
const GATEWAY_URL = "http://localhost:8080/api/v1/trips";

const token = localStorage.getItem("access_token");

const getUserTrips = async () => {
  const response = await axios.get(GATEWAY_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

const tripImport = async (file, type) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tripType", type);
  const response = await axios.post(
    "http://localhost:8080/api/v1/trips/import",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
}

const deleteTrip = async (tripId) => {
  const response = await axios.delete(GATEWAY_URL + "/" + tripId, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

const tripService = {
  getUserTrips,
  tripImport,
  deleteTrip
}

export default tripService;