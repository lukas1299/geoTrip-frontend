import API from "./api"; 

const getUserTrips = async () => {
  const response = await API.get("/trips");
  return response.data;
}

const tripImport = async (file, type) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tripType", type);
  
  const response = await API.post("/trips/import", formData);
  return response.data;
}

const deleteTrip = async (tripId) => {
  const response = await API.delete(`/trips/${tripId}`);
  return response.data;
}

const updateFavoriteStatus = async (tripId, isFavorite) => {
  const response = await API.patch(`/trips/${tripId}`, {
    "isFavorite":isFavorite
  });
  return response.data;
}

const saveUserTrip = async (tripPoints) => {
  const response = await API.post(`/trips/custom`,
    tripPoints
  );
  return response.data;
}

const tripService = { getUserTrips, tripImport, deleteTrip, updateFavoriteStatus, saveUserTrip};
export default tripService; 