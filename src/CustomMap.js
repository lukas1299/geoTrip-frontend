import './App.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";

import Start from "./img/pin_start.png";
import End from "./img/pin_end.png";

import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

const startIcon = L.icon({
  iconUrl: Start,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const endIcon = L.icon({
  iconUrl: End,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// L.Icon.Default.mergeOptions({
//    iconUrl: Heart
// });

const ChangeView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
};

const CustomMap = ({ points }) => {

  const defaultCenter = [52.1911, 19.3554];
  const center = points.length > 0 ? points[0] : defaultCenter;

  return (

    <MapContainer
      style={{ height: "100vh", width: "70%" }}
      center={center}
      zoom={15}
    >
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.length > 0 && (
        <>
          <Marker position={points[0]} icon={startIcon} >
            <Popup>
              Start
            </Popup>
          </Marker>
          <Marker position={points[points.length - 1]} icon={endIcon}>
            <Popup>
              Koniec
            </Popup>
          </Marker>
        </>
      )}


      <Polyline positions={points}>

      </Polyline>
      {/* {points.map((point, index) => (
          
        
        ))} */}

    </MapContainer>
  );
}

export default CustomMap;
