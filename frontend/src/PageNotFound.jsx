import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { HouseFill } from 'react-bootstrap-icons';

export default function Error() {
  return (
    <Container className="align-self-center mt-3 mb-3">
      <Row>
        <Col md={12} className="text-center">
          <span className="display-1">404</span>
          <div className="mb-4 lead">Oops! We can&apos;t seem to find the page you are looking for.</div>
          <Link to="/">
            <HouseFill />
            &nbsp;
            Back to Home
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
