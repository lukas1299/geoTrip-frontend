import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import Start from "./img/pin_start.png";
import End from "./img/pin_end.png";
import StartTrip from "./img/start.png";
import FinishTrip from "./img/finish.png";

import graphhopperService from "./services/graphhopper.service";

import L from "leaflet";

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

const startPlanningTripIcon = L.icon({
  iconUrl: StartTrip,
  iconSize: [30, 34],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const endPlanningTripIcon = L.icon({
  iconUrl: FinishTrip,
  iconSize: [30, 34],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const ChangeView = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
};

const MapClickHandler = ({ hearingFinish, setPosition, setLastPointPosition }) => {
  const map = useMapEvents({
    click(e) {
      if (!hearingFinish) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
      } else {
        setLastPointPosition([e.latlng.lat, e.latlng.lng]);
        map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
      }
    },
  });

  return null;
};

const CustomMap = ({ points, hearing }) => {
  const [hearingFinish, setHearingFinish] = useState(false);
  const [position, setPosition] = useState([50.041707, 22.002525]);
  const [lastPointPosition, setLastPointPosition] = useState([50.041707, 22.002525]);
  const [exampleTripPoints, setExampleTripPoints] = useState([]);

  const center = points.length > 0 ? points[0] : position;

  const addStartPoint = () => {
    setHearingFinish(true);
  };

  const generateExampleTrip = async () => {
    const res = await graphhopperService.loadExapleTrip(position, lastPointPosition);
  
    console.log(res);
    setExampleTripPoints([
      res
    ]);
  };

  return (
    <MapContainer style={{ height: "100vh", width: "70%" }} center={center} zoom={10}>
      {points.length > 0 && <ChangeView center={center} />}

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {points.length > 0 && (
        <>
          <Marker position={points[0]} icon={startIcon}>
            <Popup>Start</Popup>
          </Marker>

          <Marker position={points[points.length - 1]} icon={endIcon}>
            <Popup>Koniec</Popup>
          </Marker>
        </>
      )}

      <MapClickHandler
        hearingFinish={hearingFinish}
        setPosition={setPosition}
        setLastPointPosition={setLastPointPosition}
      />

      {hearing && (
        <Marker icon={startPlanningTripIcon} position={position}>
          <Popup>
            <input
              style={{ backgroundColor: "#1e7433", color: "white", borderRadius: "10px" }}
              type="button"
              value="Dodaj punkt startowy"
              onClick={addStartPoint}
            />
          </Popup>
        </Marker>
      )}

      {hearingFinish && (
        <Marker icon={endPlanningTripIcon} position={lastPointPosition}>
          <Popup>
            <input
              style={{
                backgroundColor: "#1e7433",
                color: "white",
                borderRadius: "10px",
                margin: "5px",
              }}
              type="button"
              value="Zaproponuj trasę"
              onClick={generateExampleTrip}
            />
            <input
              style={{ backgroundColor: "#0288d1", color: "white", borderRadius: "10px" }}
              type="button"
              value="Zapisz trasę"
            />
          </Popup>
        </Marker>
      )}

      {points.length > 0 && <Polyline positions={points} />}

      {exampleTripPoints.length > 0 && <Polyline positions={exampleTripPoints} pathOptions={{color:"#f54242"}} />}
    </MapContainer>
  );
};

export default CustomMap;