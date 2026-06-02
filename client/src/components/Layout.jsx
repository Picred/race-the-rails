import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Col, Container, Row } from "react-bootstrap";

export const Layout = () => {
    return (
        <Container fluid className="p-0" >
            <Row className="bg-dark text-white p-0 m-0" style={{ background: "linear-gradient(0deg, #111111 0%, #202020 100%)" }}>
                <Col xs={2} className="p-0">
                    <Sidebar/>
                </Col>

                <Col xs={10} className="p-0">
                    <Outlet/>
                </Col>
            </Row>
        </Container>
    )

}