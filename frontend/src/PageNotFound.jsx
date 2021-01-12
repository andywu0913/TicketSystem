import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import {HouseFill} from 'react-bootstrap-icons';

class Error extends Component {
  render() {
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col md={12} className="text-center">
            <span className="display-1">404</span>
            <div className="mb-4 lead">Oops! We can't seem to find the page you are looking for.</div>
            <Link to="/"><HouseFill /> Back to Home</Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Error;
