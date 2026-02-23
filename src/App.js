
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
import { FileUploader } from "react-drag-drop-files";
import CloadUploadIcon from './img/cloud-upload-fill.png';

import Bicycle from './img/cycling.png';
import Running from './img/nordic_walking.png';
import Walking from './img/walk.png';
import NordicWalking from './img/nordic_walking.png';
import Chart from './img/chart.png';
import Clock from './img/clock.png';
import Distance from './img/distance.png';
import StopWatch from './img/stopwatch.png';
import Heart from './img/heart.png';
import Strenght from './img/strenght.png';
import Fire from './img/fire.png';
import Logo from './img/logo.png';


import Person from './img/person.png';
import Dropdown from 'react-bootstrap/Dropdown';


const App = () => {

    const [popupHidden, setPopupHidden] = useState(true);
    const [dragAndDropHidden, setDragAndDropHidden] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [tripPoints, setTripPoints] = useState([]);

    const [trips, setTrips] = useState([]);

    const fileTypes = ["JPG", "PNG", "GIF", "CSV"];

    const handlePopupHidden = () => {
        if (popupHidden) {
            setDragAndDropHidden(true);
            console.log("asd");
        }
        setPopupHidden(!popupHidden);
    }

    const handleDragAndDropHidden = () => {
        setDragAndDropHidden(!dragAndDropHidden);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.login(username, password);

            setPopupHidden(true);

            const list = await tripService.getUserTrips();

            console.log(list);
            setTrips(list);

        } catch (error) {
            console.error(error);
        }

    };

    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        console.log(file.name);
        setFile(file);
    };

    return (<div className="App" style={{ display: "flex" }}>
        <CustomMap latitude={50.094444} longitude={21.483333} points={tripPoints} />
        <div style={{ width: "30%", height: "100vh", backgroundColor: "#5bba75" }}>

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
                <div style={{ width: "350px", height: "100px", backgroundColor: "#afc1c7" }}>
                    <FileUploader
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes}
                    >
                        <div style={{
                            width: "350px",
                            height: "100px",
                            backgroundColor: "#afc1c7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                        }}>
                            <h5>Przeciągnij plik tutaj</h5>
                        </div>
                    </FileUploader>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "40px", alignItems: "center" }}>

                    <div style={{ width: "200px", height: "50px", marginTop: "15px" }}>
                        <img src={Logo} />
                        <a style={{ fontWeight: "bold" }}>GeoTrip</a>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div onClick={handleDragAndDropHidden} style={{ width: "50px", height: "50px", marginRight: "15px" }}>
                            <img src={CloadUploadIcon} style={{ height: "25px", width: "25px", marginTop: "15px", cursor: "pointer" }} />
                        </div>
                        <img
                            src={Person}
                            onClick={handlePopupHidden}
                            style={{ border: "solid", width: "50px", height: "50px", backgroundColor: "white", borderRadius: "25px", cursor: "pointer", margin: "15px" }}
                        />
                    </div>
                </div>
                <div style={{ width: "100%", height: "30px", backgroundColor: "#5bba75", display: "flex", alignItems: "center", padding: "0 15px" }}>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" size='sm' variant='warning'>
                            <img src={NordicWalking} style={{ width: "30px", height: "30px", marginRight: "5px" }} />
                            <a style={{ fontWeight: "bold", margin: "5px" }}>Aktywność</a>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                                <img src={Bicycle} style={{ width: "30px", height: "30px" }} />
                                <a style={{ fontWeight: "bold", margin: "5px" }}>Rower</a></Dropdown.Item>
                            <Dropdown.Item href="#/action-2">
                                <img src={Running} style={{ width: "30px", height: "25px", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
                                <a style={{ fontWeight: "bold", margin: "5px" }}>Marsz</a></Dropdown.Item>
                            <Dropdown.Item href="#/action-3">
                                <img src={Walking} style={{ width: "30px", height: "25px", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
                                <a style={{ fontWeight: "bold", margin: "5px" }}>Bieg</a></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <img src={Chart} style={{ width: "27px", height: "25px", marginLeft: "auto", cursor: "pointer" }} />
                </div>

                {trips.map(trip => (
                    <div key={trip.id} onClick={() => {
                        const points = trip.pointList.map(point => [
                            point.latitude,
                            point.longitude
                        ]);
                        setTripPoints(points);
                    }} style={{ display: "flex", width: "70%", height: "100px", backgroundColor: "#49915c", borderRadius: "50px", marginTop: "20px", cursor: "pointer" }}>
                        <div style={{ width: "90px", height: "90px", border: "solid", backgroundColor: "white", borderRadius: "50px", margin: "5px" }}></div>
                        <div style={{ marginTop: "32px", marginLeft: "30px", fontSize: "20px" }}><a style={{ fontWeight: "bold" }}>1:06:52</a> <a style={{ marginLeft: "50px", fontWeight: "bold", color: "#fec007" }}>10.14 km</a></div>
                    </div>
                ))}
                <div style={{ display: "flex", width: "70%", height: "100px", backgroundColor: "#49915c", borderRadius: "50px", marginTop: "20px", cursor: "pointer" }}>
                    <div style={{ width: "90px", height: "90px", border: "solid", backgroundColor: "white", borderRadius: "50px", margin: "5px" }}></div>
                    <div style={{ marginTop: "32px", marginLeft: "30px", fontSize: "20px" }}><a style={{ fontWeight: "bold" }}>1:06:52</a> <a style={{ marginLeft: "50px", fontWeight: "bold", color: "#fec007" }}>10.14 km</a></div>
                </div>
                <div style={{ display: "flex", width: "70%", height: "100px", backgroundColor: "#49915c", borderRadius: "50px", marginTop: "20px", cursor: "pointer" }}>
                    <div style={{ width: "90px", height: "90px", border: "solid", backgroundColor: "white", borderRadius: "50px", margin: "5px" }}></div>
                    <div style={{ marginTop: "32px", marginLeft: "30px", fontSize: "20px" }}><a style={{ fontWeight: "bold" }}>1:06:52</a> <a style={{ marginLeft: "50px", fontWeight: "bold", color: "#fec007" }}>10.14 km</a></div>
                </div>

                <div style={{ backgroundColor: "#49915c", width: "90%", height: "250px", borderRadius: "10px", display:"flex", marginTop:"20px" }}>
                    <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
                        <a><img src={Clock} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft:"10px", color:"#fec007" }}>1:06:52</a></a>
                        <a><img src={Distance} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft:"10px", color:"#7af1ff" }}>10.14 km</a></a>
                        <a><img src={StopWatch} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft:"10px" }}>6'36"/km</a></a>
                    </div>
                    <div style={{ width: "50%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
                        <a><img src={Heart} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft:"10px", color:"#5bba75" }}>164 BMP</a></a>
                        <a><img src={Strenght} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft:"10px", color:"#e89715" }}>174 W</a></a>
                        <a><img src={Fire} style={{ width: "40px" }} /><a style={{ fontWeight: "bold", fontSize: "20px", marginLeft:"10px", color:"#eb4034" }}>732 KCAL</a></a>
                    </div>
                </div>

            </div>
        </div>
    </div>);
}
export default App;