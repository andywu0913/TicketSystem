import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import UpdateTicketModal from 'SRC/commons/Modal/UpdateTicketModal';
import { getAccessToken } from 'SRC/utils/jwt';

import TicketList from './TicketList';

import BackendURL from 'BackendURL';

export default function Audiance() {
  const params = useParams();
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
    axios.get(`${BackendURL}/ticket/session/${params.id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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
          <h1 className="text-dark">Audiance</h1>
          <hr />
        </Col>
      </Row>
      <TicketList
        tickets={data}
        updateTicket={updateTicket}
        deleteTicket={deleteTicket}
      />
      <UpdateTicketModal
        show={showUpdateTicketModal}
        ticketId={ticketObj.id}
        seatNo={ticketObj.seatNo}
        hideModal={() => setShowUpdateTicketModal(false)}
        reloadData={() => setNeedReload(true)}
      />
    </Container>
  );
}
