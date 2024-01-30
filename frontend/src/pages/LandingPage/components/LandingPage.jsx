import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";

function LandingPage() {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="justify-content-md-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold">Welcome to AI-CV Generator!</h1>
          <p className="lead mt-4">
            Tired of the endless cycle of customizing your CV for every job
            application? Discover the revolutionary AI-CV Generator! In just
            seconds, transform your job search experience with a bespoke CV
            perfectly tailored to each job description. Say goodbye to hours of
            tedious editing and hello to effortless, impactful applications.
            Don't miss out on your dream job – let AI-CV Generator be your
            secret weapon in landing your ideal role faster and more efficiently
            than ever before!
          </p>
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" className="mx-2" href="#login">
              Login
            </Button>
            <Button variant="success" className="mx-2" href="#signup">
              Sign Up
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LandingPage;
