import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import axios from 'axios';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

function TicketList(props) {
  const { data, reloadData } = props;
  const tickets = data.map((ticket) => (
    <tr key={ticket.id}>
      <td className="align-middle text-nowrap">{ticket.id}</td>
      <td className="align-middle text-nowrap">{ticket.user_id}</td>
      <td className="align-middle text-nowrap">{ticket.name}</td>
      <td className="align-middle text-nowrap">{ticket.email}</td>
      <td className="align-middle text-nowrap">{ticket.seat_no}</td>
      <td className="align-middle text-nowrap">{new Date(ticket.book_time).toLocaleString()}</td>
      <td className="align-middle d-flex">
        <Button variant="primary" className="m-1 text-nowrap" onClick={() => {}}>
          <PencilSquare size="1.25rem" />{' '}Edit
        </Button>
        <Button variant="danger" className="m-1 text-nowrap" onClick={() => handleDelete(ticket.id, reloadData)}>
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

function handleDelete(id, reloadData) {
  const accessToken = getAccessToken();
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (!result.isConfirmed) {
      return;
    }
    axios.delete(`${BackendURL}/ticket/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => reloadData());
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const message = error.response.data.error_msg || '';
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  });
}

TicketList.propTypes = {
  data: PropTypes.instanceOf(Array),
  reloadData: PropTypes.func,
};

TicketList.defaultProps = {
  data: [],
  reloadData: () => {},
};

export default TicketList;
