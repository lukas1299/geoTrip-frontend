
import './App.css';
import 'leaflet/dist/leaflet.css';
import CustomMap from './CustomMap.js';
import authService from './services/auth.service.js';
import tripService from './services/trip.service.js';
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from '@mui/material/Alert';
import { FileUploader } from "react-drag-drop-files";

import Bicycle from './img/cycling.png';
import Running from './img/nordic_walking.png';
import Walking from './img/walk.png';
import NordicWalking from './img/nordic_walking.png';
import Chart from './img/chart.png';
import Clock from './img/clock.png';
import Distance from './img/distance.png';
import StopWatch from './img/stopwatch.png';
import Heart from './img/heart.png';
import Strenght from './img/strength.png';
import Fire from './img/fire.png';
import Bin from './img/bin.png';
import Cog from './img/cog.png';
import MapSearch from './img/map_search.png';

import MapImage from './img/MapImage.png';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Person from './img/person.png';
import Dropdown from 'react-bootstrap/Dropdown';

import { ReactComponent as Git } from './img/github.svg';
import { ReactComponent as CloadUploadIcon } from './img/cloud.svg';
import { ReactComponent as Logo } from './img/map.svg';
import { ReactComponent as Gear } from './img/gear-fill.svg';
import { ReactComponent as TripSearch } from './img/pin-map-fill.svg';

import { ReactComponent as Graph } from './img/graph-up-arrow.svg';

const App = () => {

    const [popupHidden, setPopupHidden] = useState(true);
    const [dragAndDropHidden, setDragAndDropHidden] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [tripPoints, setTripPoints] = useState([]);

    const [distance, setDistance] = useState("0.0");
    const [time, setTime] = useState("0:00:00");
    const [rate, setRate] = useState("0'0''/km");
    const [pulse, setPulse] = useState("0");
    const [calorie, setCalorie] = useState("0");
    const [strength, setStrength] = useState("0");
    const [generateTripAlert, setGenerateTripAlert] = useState(true);

    const [selectedTripType, setSelectedTripType] = useState("RUN");

    const [trips, setTrips] = useState([]);
    const [hearing, setHearing] = useState(false);

    const [binHidden, setBinHidden] = useState(false);
    const [tripViewHidden, setTripViewHidden] = useState(false);
    const [chartViewHidden, setChartViewHidden] = useState(true);

    const [tripSearchIconColor, setTripSearchIconColor] = useState("#57C95B");
    const [gearIconColor, setGearIconColor] = useState("#57C95B");
    const [graphIconColor, setGraphIconColor] = useState("#57C95B");
    const [cloadUploadIconColor, setCloadUploadIconColor] = useState("#57C95B");

    const fileTypes = ["XML"];

    const handlePopupHidden = () => {
        if (popupHidden) {
            setDragAndDropHidden(true);
        }
        setPopupHidden(!popupHidden);
    }

    const handleTripViewHidden = () => {
        setTripViewHidden(!tripViewHidden);
        setChartViewHidden(!chartViewHidden);
    }

    const handleDragAndDropHidden = () => {
        setDragAndDropHidden(!dragAndDropHidden);
    }

    const handleBinHidden = () => {
        setBinHidden(!binHidden);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.login(username, password);
            setPopupHidden(true);

            const list = await tripService.getUserTrips();
            setTrips(list);

        } catch (error) {
            console.error(error);
        }
    };

    const [file, setFile] = useState(null);
    const handleChange = async (file) => {
        try {
            await tripService.tripImport(file, "RUN");

            setDragAndDropHidden(true);

            const list = await tripService.getUserTrips();
            console.log(list);
            setTrips(list);

        } catch (error) {
            console.error("Błąd podczas importu:", error);
        }
    };

    function msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    const handleDeleteTrip = async (tripId) => {
        try {
            await tripService.deleteTrip(tripId);
            const list = await tripService.getUserTrips();
            setTrips(list);

        } catch (error) {
            console.error("Błąd podczas importu:", error);
        }
    }

    const handleGenerateTripAlert = () => {
        setGenerateTripAlert(false);
        setTripPoints([]);
        setHearing(true);
    }

    return (<div className="App" style={{ display: "flex" }}>
        <CustomMap latitude={50.094444} longitude={21.483333} points={tripPoints} hearing={hearing} onPointSelect={setGenerateTripAlert} />
        <div style={{ width: "30%", height: "100vh", backgroundColor: "#1A1F2B" }}>

            <div id="popup" hidden={popupHidden} style={{ width: "230px", height: "270px", backgroundColor: "white", position: "fixed", top: "30px", right: "30px", borderRadius: "20px" }}>
                <h3 style={{ margin: "15px" }}>Logowanie</h3>
                <Form onSubmit={handleSubmit} style={{ marginLeft: "15px", marginTop: "20px", width: "245px" }} >
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">

                        <Col sm="10">
                            <Form.Control onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Nazwa użytkownika" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">

                        <Col sm="10">
                            <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Hasło" />
                        </Col>
                    </Form.Group>
                    <Button type='submit' style={{ marginLeft: "23%", width: "100px" }} variant="outline-dark">Zaloguj</Button>
                </Form>
                <div style={{ margin: "10px" }}>
                    <a href=''>Rejestracja</a>
                </div>
            </div>
            <div id="dragAndDrop" hidden={dragAndDropHidden} style={{ position: "fixed", top: "60px", right: "90px" }}>
                <div style={{ width: "310px", height: "100px", backgroundColor: "#1e7433" }}>
                    <FileUploader
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes}
                    >
                        <div style={{
                            width: "350px",
                            height: "100px",
                            backgroundColor: "#2A2F3E",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "white"
                        }}>
                            <h5>Przeciągnij plik tutaj</h5>
                        </div>
                    </FileUploader>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "40px", alignItems: "center" }}>

                    <div style={{ width: "200px", height: "50px", marginTop: "15px" }}>
                        <Logo style={{ color: "#57C95B", width: "50px", height: "30px" }} />
                        <a style={{ fontWeight: "bold", color: "white" }}>GeoTrip</a>
                    </div>
                    <Alert variant="filled" severity="info" style={{ position: "fixed", right: "0", margin: "10px" }} hidden={generateTripAlert}>
                        Wybierz miejsce rozpoczęcia trasy.
                    </Alert>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div onClick={handleDragAndDropHidden} style={{ width: "50px", height: "50px", marginRight: "0px", marginTop: "20px" }}>
                            <CloadUploadIcon style={{ width: "30px", height: "25px", color: cloadUploadIconColor, cursor:"pointer"}}onMouseEnter={() => setCloadUploadIconColor("#155017")}
                            onMouseLeave={() => setCloadUploadIconColor("#57C95B")} />
                        </div>
                        <img
                            src={Person}
                            onClick={handlePopupHidden}
                            style={{ border: "solid", width: "50px", height: "50px", backgroundColor: "white", borderRadius: "25px", cursor: "pointer", margin: "15px" }}
                        />
                    </div>
                </div>
                <div style={{ width: "100%", height: "30px", backgroundColor: "#1A1F2B", display: "flex", alignItems: "center", padding: "0 15px" }}>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" size='sm' style={{
                            backgroundColor: "#57C95B",
                            borderColor: "#57C95B",
                            color: "#2A2F3E",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <img src={NordicWalking} style={{ width: "30px", height: "30px", marginRight: "5px" }} />
                            <a style={{ fontWeight: "bold", margin: "5px" }}>Aktywność</a>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSelectedTripType("BIKE")}>
                                <img src={Bicycle} style={{ width: "30px", height: "30px" }} />
                                <a style={{ fontWeight: "bold", margin: "5px" }}>Rower</a></Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedTripType("WALK")}>
                                <img src={Running} style={{ width: "30px", height: "25px", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
                                <a style={{ fontWeight: "bold", margin: "5px" }}>Marsz</a></Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedTripType("RUN")}>
                                <img src={Walking} style={{ width: "30px", height: "25px", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
                                <a style={{ fontWeight: "bold", margin: "5px" }}>Bieg</a></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>

                        <TripSearch
                            style={{ width: "27px", height: "25px", cursor: "pointer", color: tripSearchIconColor}}
                            onClick={() => handleGenerateTripAlert()}
                            onMouseEnter={() => setTripSearchIconColor("#155017")}
                            onMouseLeave={() => setTripSearchIconColor("#57C95B")}
                        />
                        <Gear
                            style={{ width: "27px", height: "25px", cursor: "pointer", color: gearIconColor }}
                            onClick={() => handleBinHidden()}
                            onMouseEnter={() => setGearIconColor("#155017")}
                            onMouseLeave={() => setGearIconColor("#57C95B")}
                        />
                        <Graph
                            style={{ width: "27px", height: "25px", cursor: "pointer", color: graphIconColor}}
                            onClick={() => handleTripViewHidden()}
                            onMouseEnter={() => setGraphIconColor("#155017")}
                            onMouseLeave={() => setGraphIconColor("#57C95B")}
                        />
                    </div>
                </div>
                <div hidden={chartViewHidden} style={{ backgroundColor: "#fbfbfb", width: "90%", height: "650px", marginTop: "50px", borderRadius: "10px" }}>
                    <a>#49915c</a>
                    <ProgressBar style={{ margin: "10px" }} now={80} label={`Zrobiono 80% km do końca wyzwania`} />
                    <Git fill="#77448b" />
                </div>
                <div hidden={tripViewHidden} style={{ width: "100%", justifyItems: "center" }}>
                    {trips
                        .filter(trip => trip.tripType == selectedTripType)
                        .slice(0, 4)
                        .map(trip => (
                            <div key={trip.id} onClick={() => {
                                const points = trip.pointList.map(point => [
                                    point.latitude,
                                    point.longitude
                                ]);
                                setTripPoints(points);
                                setDistance(trip.distance);
                                setDragAndDropHidden(true);
                                setTime(msToTime(trip.totalTime).substring(0, 8));
                            }} style={{
                                display: "flex",
                                width: "90%",
                                height: "100px",
                                backgroundColor: "#2A2F3E",
                                borderRadius: "50px",
                                marginTop: "20px",
                                cursor: "pointer",
                                alignItems: "center"
                            }}>

                                <div style={{ minWidth: "90px", width: "90px", height: "90px", border: "solid", backgroundColor: "white", borderRadius: "50px", margin: "5px", borderColor: "#59be5c", overflow: "hidden" }}>
                                    <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={MapImage} alt="Map" />
                                </div>


                                <div style={{
                                    flex: 1,
                                    fontSize: "20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0 25px"
                                }}>
                                    <span style={{ fontWeight: "bold", color: "white" }}>
                                        {msToTime(trip.totalTime).substring(0, 8)}
                                    </span>
                                    <span style={{ fontWeight: "bold", color: "white" }}>
                                        6'25"/km
                                    </span>

                                    <span style={{ fontWeight: "bold", color: "#fec007" }}>
                                        {String(trip.distance).substring(0, 4)} km
                                    </span>
                                </div>

                                {binHidden && (
                                    <img
                                        src={Bin}
                                        alt="Delete"
                                        style={{ width: "30px", height: "30px", marginRight: "25px" }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTrip(trip.id);
                                        }}
                                    />
                                )}
                            </div>
                        ))}

                    <div style={{ backgroundColor: "#2A2F3E", width: "90%", height: "250px", borderRadius: "10px", display: "flex", marginTop: "20px" }}>
                        <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
                            <a><img src={Clock} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "10px", color: "#fec007" }}>{time}</a></a>
                            <a><img src={Distance} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "10px", color: "#9CA3AF" }}>{new String(distance).substring(0, 4)} km</a></a>
                            <a><img src={StopWatch} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "10px", color: "#9CA3AF" }}>{rate}</a></a>
                        </div>
                        <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
                            <a><img src={Heart} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "10px", color: "#9CA3AF" }}>{pulse} BMP</a></a>
                            <a><img src={Strenght} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "10px", color: "#9CA3AF" }}>{strength} W</a></a>
                            <a><img src={Fire} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "10px", color: "#ce6d5b" }}>{calorie} KCAL</a></a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>);
}
export default App;