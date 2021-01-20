import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

import TicketCard from './TicketCard';

function TicketCardList(props) {
  const { data } = props;
  if (data.length === 0) {
    return <Empty />;
  }
  return (
    <>
      {data.map((ticket) => <TicketCard key={ticket.id} data={ticket} updateTicket={props.showTicketUpdateModal} />)}
    </>
  );
}

function Empty() {
  return (
    <Row className="m-5 p-5 text-center text-muted">
      <Col>
        <h6>No available ticket currently.</h6>
      </Col>
    </Row>
  );
}

TicketCardList.propTypes = {
  data: PropTypes.instanceOf(Array),
  showTicketUpdateModal: PropTypes.func,
};

TicketCardList.defaultProps = {
  data: [],
  showTicketUpdateModal: () => {},
};

export default TicketCardList;
