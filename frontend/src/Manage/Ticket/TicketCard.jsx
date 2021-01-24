import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Carousel, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ClockFill, GearFill, GeoAltFill } from 'react-bootstrap-icons';

function TicketCard(props) {
  const { data } = props;
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Container>
            <Row>
              <Col sm={12} md={6} lg={3} className="pl-0 pr-0">
                <Carousel interval={2000}>
                  <Carousel.Item>
                    <img className="d-block w-100" src="https://via.placeholder.com/300x200" alt="" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img className="d-block w-100" src="https://via.placeholder.com/300x200" alt="" />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img className="d-block w-100" src="https://via.placeholder.com/300x200" alt="" />
                  </Carousel.Item>
                </Carousel>
              </Col>
              <Col sm={12} md={6} lg={4} className="pl-0 pr-0">
                <Card.Body className="p-3">
                  <Card.Title>
                    <Link to={`/event/${data.event_id}`} className="text-reset">
                      <h4 className="text-dark">{data.name}</h4>
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    <GeoAltFill className="text-muted" /> {data.address}
                  </Card.Text>
                  <Card.Text>
                    <ClockFill className="text-muted" /> {new Date(data.time).toLocaleString()}
                  </Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>Seat No. {data.seat_no}</Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>Price {data.price}</Card.Text>
                </Card.Body>
              </Col>
              <Col sm={12} md={12} lg={1} className="align-self-center text-center p-2">
                {data.session_is_active
                  ? (
                    <Link to="#" onClick={() => props.updateTicket(data.id, data.seat_no)} className="text-reset">
                      <GearFill className="text-muted" size="1.25rem" />
                    </Link>
                  )
                  : (
                    <OverlayTrigger overlay={<Tooltip>Cannot modify this ticket right now. The event host has locked this session.</Tooltip>}>
                      <GearFill className="text-light" size="1.25rem" />
                    </OverlayTrigger>
                  )}
              </Col>
            </Row>
          </Container>
        </Card>
      </Col>
    </Row>
  );
}

TicketCard.propTypes = {
  data: PropTypes.instanceOf(Object),
};

TicketCard.defaultProps = {
  data: {},
};

export default TicketCard;
