import '../App.css';
import 'leaflet/dist/leaflet.css';
import CustomMap from '../pages/CustomMap.js';
import tripService from '../services/trip.service.js';
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from '@mui/material/Alert';
import { FileUploader } from "react-drag-drop-files";

import { ReactComponent as Clock } from '../img/clock.svg';
import { ReactComponent as Distance } from '../img/distance.svg';
import { ReactComponent as StopWatch } from '../img/stopWatch.svg';
import { ReactComponent as Heart } from '../img/heart.svg';
import { ReactComponent as Strenght } from '../img/strenght.svg';
import { ReactComponent as Fire } from '../img/fire.svg';

import Person from '../img/person.png';
import Dropdown from 'react-bootstrap/Dropdown';

import { useNavigate } from 'react-router-dom';
import { ReactComponent as CloadUploadIcon } from '../img/cloud.svg';
import { ReactComponent as OpenDoor } from '../img/door-open.svg';
import { ReactComponent as Logo } from '../img/map.svg';
import { ReactComponent as Gear } from '../img/gear-fill.svg';
import { ReactComponent as TripSearch } from '../img/pin-map-fill.svg';
import { ReactComponent as Graph } from '../img/graph-up-arrow.svg';
import { ReactComponent as Pencil } from '../img/pencil.svg';
import { ReactComponent as Star } from '../img/star.svg';
import { ReactComponent as FillStar } from '../img/star-fill.svg';
import { ReactComponent as Check } from '../img/check-circle-fill.svg';

import { ReactComponent as Delete } from '../img/delete.svg';

import { ReactComponent as Cycling } from '../img/cycling.svg';
import { ReactComponent as Running } from '../img/running.svg';
import { ReactComponent as Walking } from '../img/walking.svg';
import { ReactComponent as QuestionMark } from '../img/questionMark.svg';


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import dataService from '../services/data.service.js';


const MainPanel = () => {

    const dataFormat = [
        { nazwa: 'Styczeń', kilometry: 0 },
        { nazwa: 'Luty', kilometry: 0 },
        { nazwa: 'Marzec', kilometry: 0 },
        { nazwa: 'Kwiecień', kilometry: 0 },
        { nazwa: 'Maj', kilometry: 0 },
        { nazwa: 'Czerwiec', kilometry: 0 },
    ];

    const [chartdata, setChartData] = useState(dataFormat);

    const [yearlyGoal, setYearlyGoal] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

    const pieChartData = [
        { name: 'Cel', value: yearlyGoal },
        { name: 'Zrobione', value: totalDistance }
    ];


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [popupHidden, setPopupHidden] = useState(true);
    const [dragAndDropHidden, setDragAndDropHidden] = useState(true);
    const [tripPoints, setTripPoints] = useState([]);

    const [distance, setDistance] = useState("0.0");
    const [time, setTime] = useState("0:00:00");
    const [rate, setRate] = useState("0'0''/km");
    const [pulse, setPulse] = useState("0");
    const [calorie, setCalorie] = useState("0");
    const [strength, setStrength] = useState("0");
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [generateTripAlert, setGenerateTripAlert] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const [selectedTripType, setSelectedTripType] = useState("RUN");
    const [dropDownText, setDropDownText] = useState("Aktywność")

    const [trips, setTrips] = useState([]);
    const [hearing, setHearing] = useState(false);

    const [binHidden, setBinHidden] = useState(false);
    const [tripViewHidden, setTripViewHidden] = useState(false);
    const [chartViewHidden, setChartViewHidden] = useState(true);
    const [favoriteVisibility, setFavoriteVisibility] = useState(false);

    const [tripSearchIconColor, setTripSearchIconColor] = useState("#57C95B");
    const [gearIconColor, setGearIconColor] = useState("#57C95B");
    const [graphIconColor, setGraphIconColor] = useState("#57C95B");
    const [cloadUploadIconColor, setCloadUploadIconColor] = useState("#57C95B");
    const [starColor, setStarColor] = useState("#57C95B");
    const [logoutColor, setLogoutIconColor] = useState("#57C95B");

    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 4; 

    const filteredTrips = trips.filter(trip => trip.tripType === selectedTripType);

    const navigate = useNavigate();

    const handleSetSelectedTripType = (type) => {
        setSelectedTripType(type);
        if (type === "RUN") {
            setDropDownText("Bieg");
        } else if (type === "WALK") {
            setDropDownText("Marsz");
        } else if (type === "BIKE") {
            setDropDownText("Rower");
        } else {
            setDropDownText("Inne");
        }
    }

    const handlePopupHidden = () => {
        if (popupHidden) {
            setDragAndDropHidden(true);
        }
        setPopupHidden(!popupHidden);
    }

    const handleTripViewHidden = () => {
        loadUserData();
        setTripViewHidden(!tripViewHidden);
        setChartViewHidden(!chartViewHidden);
    }

    const handleDragAndDropHidden = () => {
        setDragAndDropHidden(!dragAndDropHidden);
    }

    const handleBinHidden = () => {
        setBinHidden(!binHidden);
    }

    const handleLogout = () => {
        navigate("/");
        localStorage.removeItem("access_token");
    }

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

    const handleChangeEditMode = (status) => {
        setEditMode(status);
    }

    const setTripData = (trip) => {
        setSelectedTripId(trip.id);
        setDistance(trip.distance);
        setRate(trip.rate);
        setPulse(trip.pulse);
        setCalorie(trip.calorie);
        setStrength(trip.strength);
        setIsFavorite(trip.isFavorite);
        setTime(msToTime(trip.totalTime).substring(0, 8));
        setFavoriteVisibility(true);
        setStarColor("#57C95B");
    }

    const updateFavoriteStatus = async (status) => {

        const result = await tripService.updateFavoriteStatus(selectedTripId, status);

        loadTrips();

        const { distance, rate, pulse, calorie, strength, isFavorite, totalTime } = result;

        setDistance(distance);
        setRate(rate);
        setPulse(pulse);
        setCalorie(calorie);
        setStrength(strength);
        setIsFavorite(isFavorite);
        setTime(msToTime(totalTime).substring(0, 8));
        setFavoriteVisibility(true);

    }

    const loadTrips = async () => {
        const list = await tripService.getUserTrips();
        setTrips(list);
    }

    function msToTime(duration) {

        if (duration === "0:00:00") return "0:00:00";

        var milliseconds = parseInt((duration % 1000) / 100)
            , seconds = parseInt((duration / 1000) % 60)
            , minutes = parseInt((duration / (1000 * 60)) % 60)
            , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    const handleScroll = (e) => {
        if (e.deltaY > 0) {
            setStartIndex((prev) =>
                Math.min(prev + 1, Math.max(0, filteredTrips.length - visibleCount))
            );
        } else {
            setStartIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    const loadUserData = async () => {
        const data = await dataService.loadData();

        const formattedData = Object.entries(data.monthlyBreakdown).map(([miesiac, wartosc]) => ({
        nazwa: miesiac,
        kilometry: wartosc
    }));
        console.log(data.monthlyBreakdown);
        setChartData(formattedData);
        setYearlyGoal(data.yearlyGoal);
        setTotalDistance(data.totalDistance);
        

    }

    useEffect(() => {
        loadTrips();
    }, []);

    return (<div className="App" style={{ display: "flex" }}>
        <CustomMap latitude={50.094444} longitude={21.483333} points={tripPoints} hearing={hearing} onPointSelect={setGenerateTripAlert} />
        <div style={{ width: "30%", height: "100vh", backgroundColor: "#1A1F2B" }}>


            <div id="dragAndDrop" hidden={dragAndDropHidden} style={{ position: "fixed", top: "60px", right: "90px" }}>
                <div style={{ width: "310px", height: "100px", backgroundColor: "#1e7433" }}>
                    <FileUploader
                        handleChange={handleChange}
                        name="file"
                        types={["XML"]}
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
                        <Logo style={{ color: "#57C95B", width: "50px", height: "30px",filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} />
                        <a style={{ fontWeight: "bold", color: "white" }}>GeoTrip</a>
                    </div>
                    <Alert variant="filled" severity="info" style={{ position: "fixed", right: "0", margin: "10px" }} hidden={generateTripAlert}>
                        Wybierz miejsce rozpoczęcia trasy.
                    </Alert>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div onClick={handleDragAndDropHidden} style={{ width: "50px", height: "50px", marginRight: "0px", marginTop: "20px" }}>
                            <CloadUploadIcon style={{ width: "30px", height: "25px", color: cloadUploadIconColor, cursor: "pointer", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} onMouseEnter={() => setCloadUploadIconColor("#155017")}
                                onMouseLeave={() => setCloadUploadIconColor("#57C95B")} />
                        </div>
                        <div onClick={handleLogout} style={{ width: "50px", height: "50px", marginRight: "0px", marginTop: "20px" }}>
                            <OpenDoor style={{ width: "30px", height: "25px", color: logoutColor, cursor: "pointer", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} onMouseEnter={() => setLogoutIconColor("#155017")}
                                onMouseLeave={() => setLogoutIconColor("#57C95B")} />
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
                            alignItems: "center",
                            filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))"
                        }}>
                            {selectedTripType === "RUN" ? <Running style={{ width: "30px", height: "30px", fill: "#2A2F3E" }} /> :
                                selectedTripType === "WALK" ? <Walking style={{ width: "30px", height: "30px", fill: "#2A2F3E" }} /> :
                                    selectedTripType === "BIKE" ? <Cycling style={{ width: "30px", height: "30px", fill: "#2A2F3E" }} /> :
                                        <QuestionMark style={{ width: "30px", height: "30px", fill: "#2A2F3E" }} />}

                            <a style={{ fontWeight: "bold", margin: "5px" }}>{dropDownText}</a>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSetSelectedTripType("RUN")}>
                                <Running style={{ fill: "#57C95B", width: "30px", height: "30px" }} />
                                <a style={{ fontWeight: "bold", margin: "5px", marginLeft: "25px", color: "#2A2F3E" }}>Bieg</a></Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSetSelectedTripType("BIKE")}>
                                <Cycling style={{ fill: "#57C95B", width: "30px", height: "30px" }} />
                                <a style={{ fontWeight: "bold", margin: "5px", marginLeft: "25px", color: "#2A2F3E" }}>Rower</a></Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSetSelectedTripType("WALK")}>
                                <Walking style={{ fill: "#57C95B", width: "30px", height: "30px" }} />
                                <a style={{ fontWeight: "bold", margin: "5px", marginLeft: "25px", color: "#2A2F3E" }}>Marsz</a></Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSetSelectedTripType("OTHER")}>
                                <QuestionMark style={{ fill: "#57C95B", width: "30px", height: "30px" }} />
                                <a style={{ fontWeight: "bold", margin: "5px", marginLeft: "25px", color: "#2A2F3E" }}>Inne</a></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>

                        <TripSearch
                            style={{ width: "27px", height: "25px", cursor: "pointer", color: tripSearchIconColor, filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }}
                            onClick={() => handleGenerateTripAlert()}
                            onMouseEnter={() => setTripSearchIconColor("#155017")}
                            onMouseLeave={() => setTripSearchIconColor("#57C95B")}
                        />
                        <Gear
                            style={{ width: "27px", height: "25px", cursor: "pointer", color: gearIconColor, filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }}
                            onClick={() => handleBinHidden()}
                            onMouseEnter={() => setGearIconColor("#155017")}
                            onMouseLeave={() => setGearIconColor("#57C95B")}
                        />
                        <Graph
                            style={{ width: "27px", height: "25px", cursor: "pointer", color: graphIconColor, filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }}
                            onClick={() => handleTripViewHidden()}
                            onMouseEnter={() => setGraphIconColor("#155017")}
                            onMouseLeave={() => setGraphIconColor("#57C95B")}
                        />
                    </div>
                </div>
                <div hidden={chartViewHidden} style={{ backgroundColor: "#2A2F3E", width: "90%", height: "650px", marginTop: "50px", borderRadius: "10px" }}>
                    <span style={{ color: "#57C95B", fontWeight: "bold", fontSize: "20px", fontFamily: "sans-serif", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }}>Statystyki</span>
                    <div style={{ width: '100%', height: "300px" }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    innerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                >

                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ width: "80%", height: "300px", margin: "auto" }}>
                        <ResponsiveContainer>
                            <BarChart data={chartdata} margin={{ top: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nazwa" />
                                <YAxis />

                                <Tooltip />
                                <Legend />

                                <Bar dataKey="kilometry" fill="#57C95B" radius={[4, 4, 0, 0]} />

                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
                <div hidden={tripViewHidden} style={{ width: "100%", justifyItems: "center" }} onWheel={handleScroll}>
                    {trips
                        .filter(trip => trip.tripType === selectedTripType)
                        .slice(startIndex, startIndex + visibleCount)
                        .map(trip => {
                            const isFav = trip.isFavorite;
                            const borderColor = isFav ? "yellow" : "#57C95B";
                            const iconColor = isFav ? "rgba(216, 252, 11, 0.83)" : "#57C95B";

                            const Icon = { RUN: Running, WALK: Walking, BIKE: Cycling }[trip.tripType] || QuestionMark;

                            return (
                                <div key={trip.id} onClick={() => {
                                    setTripPoints(trip.pointList.map(p => [p.latitude, p.longitude]));
                                    setDistance(trip.distance);
                                    setDragAndDropHidden(true);
                                    setTripData(trip);
                                }} style={{
                                    display: "flex", width: "90%", height: "100px", backgroundColor: "#2A2F3E",
                                    borderRadius: "50px", marginTop: "20px", cursor: "pointer", alignItems: "center",
                                    border: `1px solid ${borderColor}`, filter: `drop-shadow(0px 2px 2px ${iconColor})`
                                }}>
                                    <div style={{ minWidth: "90px", height: "90px", borderRadius: "50%", margin: "5px", backgroundColor: iconColor, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Icon style={{ width: "60%", height: "60%", fill: "#2A2F3E", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} />
                                    </div>
                                    <div style={{ flex: 1, fontSize: "20px", display: "flex", justifyContent: "space-between", padding: "0 25px", color: "white", fontWeight: "bold" }}>
                                        <span>{msToTime(trip.totalTime).substring(0, 8)}</span>
                                        <span>{trip.rate}</span>
                                        <span style={{ color: "#fec007" }}>{String(trip.distance).substring(0, 4)} km</span>
                                    </div>
                                    {binHidden && <Delete style={{ width: "30px", height: "30px", marginRight: "15px", fill: "#e44848" }} onClick={() => handleDeleteTrip(trip.id)} />}
                                </div>
                            );
                        })}

                    <div style={{ backgroundColor: "#2A2F3E", width: "90%", minHeight: "250px", borderRadius: "10px", display: "flex", marginTop: "20px", justifyContent: "space-around", padding: "10px" }}>
                        {[
                            { col: 1, items: [[Clock, time, "", "#fec007"], [Distance, `${String(distance).substring(0, 4)} km`, "", "#9CA3AF"], [StopWatch, rate, "", "#9CA3AF"]] },
                            { col: 2, items: [[Heart, pulse, "BMP", "#9CA3AF"], [Strenght, strength, "W", "#9CA3AF"], [Fire, calorie, "KCAL", "#ce6d5b"]] }
                        ].map((column, idx) => (
                            <div key={idx} style={{ width: "40%", display: "flex", flexDirection: "column", justifyContent: "center", gap: "25px" }}>
                                {column.items.map(([Icon, val, label, color], i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ width: "40px", display: "flex", justifyContent: "center" }}><Icon style={{ filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} /></div>
                                        {editMode && idx === 1 ? (
                                            <>
                                                <input style={{ width: "50px", backgroundColor: "#1F232F", border: "none", marginLeft: "15px", borderRadius: "5px", textAlign: "center", color: "red", fontWeight: "bold" }} placeholder={val} onInput={(e) => console.log(e.target.value + " " + i)} />
                                                <span style={{ fontWeight: "bold", marginLeft: "10px", color: "#9CA3AF" }}>{label}</span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: "bold", fontSize: "20px", marginLeft: "15px", color: idx === 0 && i === 0 ? color : "#9CA3AF" }}>{val} {label}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {favoriteVisibility && (
                            <div style={{ width: "10%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                                {editMode ?
                                    <Check style={{ fill: "#57C95B", width: "20px", height: "20px", cursor: "pointer", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} onClick={() => handleChangeEditMode(false)} /> :
                                    <Pencil style={{ fill: "#57C95B", width: "20px", height: "20px", cursor: "pointer", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} onClick={() => handleChangeEditMode(true)} />
                                }
                                <div onClick={() => updateFavoriteStatus(!isFavorite)} onMouseEnter={() => setStarColor("yellow")} onMouseLeave={() => setStarColor("#57C95B")} style={{ cursor: "pointer" }}>
                                    {isFavorite ?
                                        <FillStar style={{ fill: "yellow", width: "20px", height: "20px", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} /> :
                                        <Star style={{ fill: starColor, width: "20px", height: "20px", filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.8))" }} />
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>);
}
export default MainPanel;