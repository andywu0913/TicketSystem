import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import axios from 'axios';
import swal from 'sweetalert2';

import UpdateTicketModal from 'SRC/commons/Modal/UpdateTicketModal';
import { getAccessToken } from 'SRC/utils/jwt';

import TicketCard from './TicketCard';

import BackendURL from 'BackendURL';

export default function Ticket() {
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);
  const [showUpdateTicketModal, setShowUpdateTicketModal] = useState(false);
  const [ticketObj, setTicketObj] = useState({});

  useEffect(() => {
    if (!needReload) {
      return;
    }
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.get(`${BackendURL}/ticket`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        const { data } = response.data;
        setData(data);
        setNeedReload(false);
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
  }, [needReload]);

  function updateTicket(ticketObj) {
    setTicketObj(ticketObj);
    setShowUpdateTicketModal(true);
  }

  function deleteTicket(id) {
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
      swal.showLoading();
      const accessToken = getAccessToken();
      axios.delete(`${BackendURL}/ticket/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(() => {
          swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
            .then(() => setNeedReload(true));
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

  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="text-dark">My Tickets</h1>
          <hr />
        </Col>
      </Row>
      {data.length > 0
        ? data.map((ticket) => (
          <TicketCard
            key={ticket.id}
            id={ticket.id}
            eventId={ticket.event_id}
            name={ticket.name}
            address={ticket.address}
            time={ticket.time}
            seatNo={ticket.seat_no}
            price={ticket.price}
            isActive={!!ticket.session_is_active}
            updateTicket={updateTicket}
            deleteTicket={deleteTicket}
          />
        ))
        : (
          <Row className="m-5 p-5 text-center text-muted">
            <Col>
              <h6>No available ticket currently.</h6>
            </Col>
          </Row>
        )}
      <UpdateTicketModal
        show={showUpdateTicketModal}
        ticketId={ticketObj.id}
        seatNo={String(ticketObj.seatNo)}
        hideModal={() => setShowUpdateTicketModal(false)}
        reloadData={() => setNeedReload(true)}
      />
    </Container>
  );
}
