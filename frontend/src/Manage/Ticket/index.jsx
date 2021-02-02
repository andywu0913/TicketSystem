import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import axios from 'axios';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import TicketCard from './TicketCard';
import TicketUpdateModal from './TicketUpdateModal';

import BackendURL from 'BackendURL';

export default function Ticket() {
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);
  const [showTicketUpdateModal, setShowTicketUpdateModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

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
        swal.close();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { error_msg: message = '' } = error.response.data;
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      })
      .then(() => {
        setNeedReload(false);
      });
  }, [needReload]);

  function updateTicket(ticketId, seatNo) {
    setSelectedTicketId(ticketId);
    setSelectedSeat(seatNo);
    setShowTicketUpdateModal(true);
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
        ? data.map((ticket) => <TicketCard key={ticket.id} data={ticket} updateTicket={updateTicket} />)
        : (
          <Row className="m-5 p-5 text-center text-muted">
            <Col>
              <h6>No available ticket currently.</h6>
            </Col>
          </Row>
        )}
      <TicketUpdateModal show={showTicketUpdateModal} ticketId={selectedTicketId} seat={selectedSeat} hideModal={() => setShowTicketUpdateModal(false)} reloadData={() => setNeedReload(true)} />
    </Container>
  );
}
