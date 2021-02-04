import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';

import moment from 'moment';
import PropTypes from 'prop-types';

function TicketList(props) {
  const { tickets, updateTicket, deleteTicket } = props;

  return (
    <Table striped bordered hover responsive className="text-center">
      <thead>
        <tr className="text-center text-nowrap">
          <th>Ticket ID</th>
          <th>Uid</th>
          <th>Name</th>
          <th>Email</th>
          <th>Seat No</th>
          <th>Book Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => {
          const bookTime = moment(ticket.book_time).format('lll');
          return (
            <tr key={ticket.id}>
              <td className="align-middle text-nowrap">{ticket.id}</td>
              <td className="align-middle text-nowrap">{ticket.user_id}</td>
              <td className="align-middle text-nowrap">{ticket.name}</td>
              <td className="align-middle text-nowrap">{ticket.email}</td>
              <td className="align-middle text-nowrap">{ticket.seat_no}</td>
              <td className="align-middle text-nowrap">{bookTime}</td>
              <td className="align-middle d-flex">
                <Button variant="primary" className="m-1 text-nowrap" onClick={() => updateTicket({ id: ticket.id, seatNo: ticket.seat_no })}>
                  <PencilSquare size="1.25rem" />&nbsp;Edit
                </Button>
                <Button variant="danger" className="m-1 text-nowrap" onClick={() => deleteTicket(ticket.id)}>
                  <TrashFill size="1.25rem" />&nbsp;Delete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

TicketList.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    user_id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    seat_no: PropTypes.number,
  })),
  updateTicket: PropTypes.func,
  deleteTicket: PropTypes.func,
};

TicketList.defaultProps = {
  tickets: [],
  updateTicket: () => {},
  deleteTicket: () => {},
};

export default TicketList;
