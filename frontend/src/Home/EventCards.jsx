import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EventCards(props) {
  const { data } = props;

  const cards = data.map((event) => {
    let { id, name, description, start_date: startDate, end_date: endDate } = event;
    description = description.replace(/(<([^>]+)>)/gi, '');
    startDate = new Date(startDate).toLocaleDateString();
    endDate = new Date(endDate).toLocaleDateString();

    return (
      <Col xs={12} md={6} lg={4} className="mb-4" key={id}>
        <Card className="h-100">
          <Card.Img src="http://via.placeholder.com/300x180" width="100%" height="auto" />
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

  return (
    <>{cards}</>
  );
}

EventCards.propTypes = {
  data: PropTypes.instanceOf(Array),
};

EventCards.defaultProps = {
  data: [],
};

export default EventCards;
