import React from 'react';
import { Card, Carousel, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import moment from 'moment';
import PropTypes from 'prop-types';

export default function EventCards(props) {
  const { data } = props;

  const cards = data.map((event) => {
    const { id, name } = event;
    let { description, start_date: startDate, end_date: endDate } = event;
    description = description.replace(/(<([^>]+)>)/gi, '');
    startDate = moment(startDate).format('ll');
    endDate = moment(endDate).format('ll');

    return (
      <Col xs={12} md={6} lg={4} className="mb-4" key={id}>
        <Card className="h-100">
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
          <Card.Body>
            <Link to={`/event/${id}`} className="text-reset">
              <Card.Title>{name}</Card.Title>
              <Card.Text>
                {description.length < 30 ? description : `${description.substring(0, 30)}...`}
              </Card.Text>
            </Link>
          </Card.Body>
          <Card.Footer className="pt-2 pb-2 text-right">
            <small className="text-muted">{startDate} ~ {endDate}</small>
          </Card.Footer>
        </Card>
      </Col>
    );
  });

  return <>{cards}</>;
}

EventCards.propTypes = {
  data: PropTypes.instanceOf(Array),
};

EventCards.defaultProps = {
  data: [],
};
