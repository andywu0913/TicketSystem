import React from 'react';
import { Button, Card, Carousel, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { ClockFill, GearFill, GeoAltFill, TrashFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import moment from 'moment';
import PropTypes from 'prop-types';

export default function TicketCard(props) {
  const { id, eventId, name, address, time, seatNo, price, isActive, updateTicket } = props;
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
                    <Link to={`/event/${eventId}`} className="text-reset">
                      <h4 className="text-dark">{name}</h4>
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    <GeoAltFill className="text-muted" /> {address}
                  </Card.Text>
                  <Card.Text>
                    <ClockFill className="text-muted" /> {moment(time).format('lll')}
                  </Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>Seat No. {seatNo}</Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>Price {price}</Card.Text>
                </Card.Body>
              </Col>
              <Col sm={12} md={12} lg={1} className="align-self-center text-center p-2">
                {isActive
                  ? (
                    <>
                      <Button variant="link" onClick={() => updateTicket(id, seatNo)}>
                        <GearFill className="text-muted" size="1.25rem" />
                      </Button>
                      <Button variant="link" onClick={() => updateTicket(id, seatNo)}>
                        <TrashFill className="text-muted" size="1.25rem" />
                      </Button>
                    </>
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
  id: PropTypes.number,
  eventId: PropTypes.number,
  name: PropTypes.string,
  address: PropTypes.string,
  time: PropTypes.string,
  seatNo: PropTypes.number,
  price: PropTypes.number,
  isActive: PropTypes.bool,
  updateTicket: PropTypes.func,
};

TicketCard.defaultProps = {
  id: null,
  eventId: null,
  name: '',
  address: '',
  time: '',
  seatNo: '',
  price: null,
  isActive: false,
  updateTicket: () => {},
};
