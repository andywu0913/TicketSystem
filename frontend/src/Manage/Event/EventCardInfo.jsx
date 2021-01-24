import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Carousel, Container, Row, Col } from 'react-bootstrap';
import { ClockFill } from 'react-bootstrap-icons';

function EventCardInfo(props) {
  const { id, name, description, startDate, endDate } = props;
  return (
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
          <Col sm={12} md={6} lg={8} className="pl-0 pr-0">
            <Card.Body className="p-3">
              <Card.Title>
                <Link to={`/event/${id}`} className="text-reset">
                  <h4 className="text-dark">{name}</h4>
                </Link>
              </Card.Title>
              <Card.Text>
                {description.length < 100 ? description : `${description.substring(0, 100)}...`}
              </Card.Text>
              <Card.Text>
                <ClockFill className="text-muted" /> {startDate} ~ {endDate}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

EventCardInfo.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

EventCardInfo.defaultProps = {
  id: null,
  name: null,
  description: null,
  startDate: null,
  endDate: null,
};

export default EventCardInfo;
