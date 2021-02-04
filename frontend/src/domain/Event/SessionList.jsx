import React from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { BagCheckFill, BagXFill } from 'react-bootstrap-icons';

import moment from 'moment';
import PropTypes from 'prop-types';

function SessionList(props) {
  const { sessions, bookTicket } = props;

  return (
    <Table striped bordered hover responsive className="text-center">
      <thead>
        <tr>
          <th className="align-middle">Info</th>
          <th className="align-middle">Sell Open Time</th>
          <th className="align-middle">Available Seats</th>
          <th className="align-middle">Price</th>
          <th className="align-middle">Action</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session.id}>
            <td className="align-middle">
              <p className="m-0">{session.address}</p>
              <p className="m-0">{moment(session.time).format('lll')}</p>
            </td>
            <td className="align-middle">
              <p className="m-0">{moment(session.ticket_sell_time_open).format('lll')}</p>
              <p className="m-0">~</p>
              <p className="m-0">{moment(session.ticket_sell_time_end).format('lll')}</p>
            </td>
            <td className="align-middle">{session.open_seats ? session.open_seats : '--'} / {session.max_seats}</td>
            <td className="align-middle">{session.price}</td>
            <td className="align-middle">
              {session.is_active
                ? (
                  <OverlayTrigger overlay={<Tooltip>Book Ticket!</Tooltip>}>
                    <Button variant="link" onClick={() => bookTicket(session)}>
                      <BagCheckFill className="text-muted" size="1.25rem" />
                    </Button>
                  </OverlayTrigger>
                )
                : (
                  <OverlayTrigger overlay={<Tooltip>Currently Inactive:(</Tooltip>}>
                    <BagXFill className="text-muted" size="1.25rem" />
                  </OverlayTrigger>
                )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

SessionList.propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    address: PropTypes.string,
    time: PropTypes.string,
    ticket_sell_time_open: PropTypes.string,
    ticket_sell_time_end: PropTypes.string,
    open_seats: PropTypes.number,
    max_seats: PropTypes.number,
    price: PropTypes.number,
    is_active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  })),
  bookTicket: PropTypes.func,
};

SessionList.defaultProps = {
  sessions: [],
  bookTicket: () => {},
};

export default SessionList;
