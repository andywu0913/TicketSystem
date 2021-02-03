import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';

import PropTypes from 'prop-types';

function TicketList(props) {
  const { data, updateTicket, deleteTicket } = props;
  const tickets = data.map((ticket) => (
    <tr key={ticket.id}>
      <td className="align-middle text-nowrap">{ticket.id}</td>
      <td className="align-middle text-nowrap">{ticket.user_id}</td>
      <td className="align-middle text-nowrap">{ticket.name}</td>
      <td className="align-middle text-nowrap">{ticket.email}</td>
      <td className="align-middle text-nowrap">{ticket.seat_no}</td>
      <td className="align-middle text-nowrap">{new Date(ticket.book_time).toLocaleString()}</td>
      <td className="align-middle d-flex">
        <Button variant="primary" className="m-1 text-nowrap" onClick={() => updateTicket(ticket.id, ticket.seat_no)}>
          <PencilSquare size="1.25rem" />{' '}Edit
        </Button>
        <Button variant="danger" className="m-1 text-nowrap" onClick={() => deleteTicket(ticket.id)}>
          <TrashFill size="1.25rem" />{' '}Delete
        </Button>
      </td>
    </tr>
  ));

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
        {tickets}
      </tbody>
    </Table>
  );
}

TicketList.propTypes = {
  data: PropTypes.instanceOf(Array),
  deleteTicket: PropTypes.func,
};

TicketList.defaultProps = {
  data: [],
  deleteTicket: () => {},
};

export default TicketList;
