import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";

function LandingPage() {
  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="justify-content-md-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold">Welcome to AI-CV Generator!</h1>
          <p className="lead mt-4">
            Streamline your job search with AI-CV Generator! Instantly craft a
            customized CV that&apos;s precision-tailored to each job
            description. Embrace the simplicity of one-click CV customization
            and propel your career forward.
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
