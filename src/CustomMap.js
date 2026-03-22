import "./App.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import Start from "./img/pin_start.png";
import End from "./img/pin_end.png";
import StartTrip from "./img/start.png";
import FinishTrip from "./img/finish.png";
import temporaryPoint from "./img/temporaryPoint.png";

import Arrow from './img/arrow.png';
import Cross from './img/cross.png';

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

const temporaryPointsIcon = L.icon({
  iconUrl: temporaryPoint,
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

const MapClickHandler = ({ hearingFinish, setStartPointPosition, setLastPointPosition }) => {
  const map = useMapEvents({
    click(e) {
      if (!hearingFinish) {
        setStartPointPosition([e.latlng.lat, e.latlng.lng]);
        map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
      } else {
        setLastPointPosition([e.latlng.lat, e.latlng.lng]);
        map.setView([e.latlng.lat, e.latlng.lng], map.getZoom());
      }
    },
  });

  return null;
};

const CustomMap = ({ points, hearing, onPointSelect}) => {
  const [hearingFinish, setHearingFinish] = useState(false);
  const [startPointPosition, setStartPointPosition] = useState([50.041707, 22.002525]);
  const [lastPointPosition, setLastPointPosition] = useState([50.041707, 22.002525]);
  const [exampleTripPoints, setExampleTripPoints] = useState([]);
  const [range, setRange] = useState(1);
  const [rangeColor, setRangeColor] = useState("blue");
  const [distance, setDistance] = useState("Krótki");
  const [saveButtonVisibility, setSaveButtonVisibility] = useState(false);
  const [temporaryPoints, setTemporaryPoints] = useState([]);

  const handleRange = (e) => {
    console.log(e.target.value);
    setRange(e.target.value);

    if (e.target.value == 1) {
      setRangeColor("blue");
      setDistance("Krótki");
    } else if (e.target.value == 2) {
      setRangeColor("orange");
      setDistance("Średni");
    } else if (e.target.value == 3) {
      setRangeColor("red");
      setDistance("Długi");
    }
  }

  const center = points.length > 0 ? points[0] : startPointPosition;

  const addStartPoint = () => {
    setHearingFinish(true);
    onPointSelect(true);
  };

  const generateExampleTrip = async () => {
    const res = await graphhopperService.loadExapleTrip(startPointPosition, lastPointPosition, range);

    console.log(res);
    setTemporaryPoints([]);
    setExampleTripPoints([
      res
    ]);
  };

  const loadTripBetweenPoints = async () => {
    const res = await graphhopperService.loadTripBetweenPoints(startPointPosition, lastPointPosition, null);
    setTemporaryPoints([]);
    setExampleTripPoints([res]);
    setSaveButtonVisibility(true);

  }

  const updateTrip = async () => {

    if(exampleTripPoints[0] == undefined) {
      exampleTripPoints[0] = [startPointPosition];
    }

    const currentPoints = exampleTripPoints[0];
    console.log("Curr:" + currentPoints);
    const lastPoint = currentPoints[currentPoints.length - 1];
    console.log("Last:" + lastPoint);

    const temp = [...temporaryPoints, lastPointPosition];
    setTemporaryPoints(temp);

    try {
      const res = await graphhopperService.loadTripBetweenPoints(lastPoint, lastPointPosition, null);
      const updatedPoints0 = [...exampleTripPoints[0], ...res];

      setExampleTripPoints([
        updatedPoints0,
        ...exampleTripPoints.slice(1)
      ]);

    } catch (error) {
      console.error("Błąd pobierania trasy:", error);
    }

  }


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
        setStartPointPosition={setStartPointPosition}
        setLastPointPosition={setLastPointPosition}
      />

      {hearing && (
        <Marker icon={startPlanningTripIcon} position={startPointPosition}>
          <Popup>
            <input
              style={{ backgroundColor: "#1e7433", color: "white", borderRadius: "10px", width: "50%" }}
              type="button"
              value="Dodaj punkt startowy"
              onClick={addStartPoint}
            />
            <input
              style={{ backgroundColor: "#3e89df", color: "white", borderRadius: "10px", margin: "5px", width: "46%" }}
              type="button"
              value="Zaproponuj trasę"
              onClick={generateExampleTrip}
            />
            <a style={{ margin: "5px", fontWeight: "bold" }}>Wybierz dystans</a>
            <div style={{
              display: "flex", width: "100%", height: "50px", backgroundColor: "#87b0df",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px"
            }}>
              <div style={{ width: "70px" }}>
                <a style={{ fontWeight: "bold" }}>{distance}</a>
              </div>
              <input style={{ margin: "20px", accentColor: rangeColor }} type="range" value={range} min="1" max="3" onChange={(e) => handleRange(e)} class="slider" id="myRange"></input>
            </div>

          </Popup>
        </Marker>
      )}

      {hearingFinish && (
        <Marker icon={endPlanningTripIcon} position={lastPointPosition}>
          <Popup>

            <input
              style={{ backgroundColor: "#0288d1", color: "white", borderRadius: "10px" }}
              type="button"
              value="Generuj trasę"
              onClick={loadTripBetweenPoints}
            />
            <input
              style={{ backgroundColor: "#eb9d44", color: "white", borderRadius: "10px", marginLeft: "5px" }}
              type="button"
              value="Dodaj punkt"
              onClick={updateTrip}
            />
            {saveButtonVisibility && (
              <input
                style={{ backgroundColor: "#6ce25c", color: "white", borderRadius: "10px", margin: "5px" }}
                type="button"
                value="Zapisz trasę"
                onClick={loadTripBetweenPoints}
              />
            )}
            <div style={{
              backgroundColor: "#6ce25c",
              width: "100%",
              height: "auto",
              minHeight: "20px",
              borderRadius: "10px",
              paddingBottom: "10px"
            }}>

              <div style={{ paddingTop: "10px" }}>
                {temporaryPoints.length > 0 && temporaryPoints.map((p, index) => (
                  <div key={index} style={{
                    color: "#000000",
                    fontWeight: "bold",
                    marginLeft: "20px",
                    marginTop: "5px",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}>
                    <img src={Arrow} style={{width:"20px", marginRight:"10px"}}/>
                    {String(p[0]).substring(0, 7)} {String(p[1]).substring(0, 7)}
                    <img src={Cross} style={{width:"15px", marginLeft:"10px", cursor:"pointer"}}/> 
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {points.length > 0 && <Polyline positions={points} />}

      {exampleTripPoints.length > 0 && <Polyline positions={exampleTripPoints} pathOptions={{ color: "#63b11a" }} />}
      {temporaryPoints.length > 0 && temporaryPoints.map((point, index) => (
        <Marker index={index} position={point} icon={temporaryPointsIcon}>

        </Marker>
      ))}
    </MapContainer>
  );
};

export default CustomMap;