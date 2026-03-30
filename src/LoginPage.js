
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { ReactComponent as SignIn } from './img/signin.svg';
import { ReactComponent as Logo } from './img/map.svg';

import authService from './services/auth.service';

import { useNavigate } from 'react-router-dom';
import map from './img/mmap.png';

const LoginPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await authService.login(username, password);
            navigate("/main-panel");

        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#1A1F2B" }}>

            <div style={{ width: "75%", height: "100vh", overflow: "hidden" }}>
                <img
                    src={map}
                    alt="Map background"
                    style={{
                        width: "97%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                    }}
                />
            </div>


            <div style={{
                backgroundColor: "#57C95B",
                width: "35%",
                height: "100vh",
                marginLeft: "-5%",
                paddingLeft: "5%",
                clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Logo style={{ width: "200px", height: "200px", marginBottom: "100px", fill: "#1A1F2B" }} />

                <div style={{ width: "245px" }}>
                    <h3 style={{ marginBottom: "20px", color: "#1A1F2B", textAlign: "center" }}>Logowanie</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                            <Col sm="12">
                                <Form.Control onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Nazwa użytkownika" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Col sm="12">
                                <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Hasło" />
                            </Col>
                        </Form.Group>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                            <Button type='submit' style={{ width: "100px" }} variant="outline-dark">
                                <SignIn />
                            </Button>
                            <a style={{ color: "#1e7433", fontSize: "14px" }} href='/register'>Rejestracja</a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;