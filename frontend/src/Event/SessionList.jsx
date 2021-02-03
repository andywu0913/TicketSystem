import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { BagCheckFill, BagXFill } from 'react-bootstrap-icons';

import axios from 'axios';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import BackendURL from 'BackendURL';

export default function SessionList(props) {
  const { eventId, bookTicket } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    swal.showLoading();
    axios.get(`${BackendURL}/session/?event_id=${eventId}`)
      .then((response) => {
        const { data } = response.data;
        setData(data);
        swal.close();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { error_msg: message = '' } = error.response.data;
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }, []);

  const sessions = data.map((session) => (
    <tr key={session.id}>
      <td className="align-middle"><p>{session.address}</p><p>{new Date(session.time).toLocaleString()}</p></td>
      <td className="align-middle"><span>{session.ticket_sell_time_open}</span> - <span>{session.ticket_sell_time_end}</span></td>
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
  ));

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
        {sessions}
      </tbody>
    </Table>
  );
}

SessionList.propTypes = {
  eventId: PropTypes.number,
  bookTicket: PropTypes.func,
};

SessionList.defaultProps = {
  eventId: 0,
  bookTicket: () => {},
};
