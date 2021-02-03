import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { PencilSquare, PeopleFill, Plus, TrashFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function EventCardSession(props) {
  const { show, id } = props;
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);

  useEffect(() => {
    if (!show || !needReload) {
      return;
    }
    swal.showLoading();
    axios.get(`${BackendURL}/session/?event_id=${id}`)
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
  }, [show, needReload]);

  return (
    <Card>
      <Container>
        <Row>
          <Col className="pl-0 pr-0">
            <Table striped bordered hover responsive="xl" className="mb-0 text-center" size="sm">
              <thead>
                <tr>
                  <th className="align-middle text-nowrap">Location</th>
                  <th className="align-middle text-nowrap">Time</th>
                  <th className="align-middle text-nowrap">Sell Open Time</th>
                  <th className="align-middle text-nowrap">Available Seats</th>
                  <th className="align-middle text-nowrap">Price</th>
                  <th className="align-middle text-nowrap">Activate</th>
                  <th className="align-middle text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0
                  ? data.map((session) => {
                    const time = moment(session.time).format('lll');
                    const sellTimeOpen = moment(session.ticket_sell_time_open).format('lll');
                    const sellTimeEnd = moment(session.ticket_sell_time_end).format('lll');

                    return (
                      <tr key={session.id}>
                        <td className="align-middle text-nowrap">{session.address}</td>
                        <td className="align-middle text-nowrap">{time}</td>
                        <td className="align-middle text-nowrap"><span>{sellTimeOpen}</span> - <span>{sellTimeEnd}</span></td>
                        <td className="align-middle text-nowrap">{session.open_seats ? session.open_seats : '--'} / {session.max_seats}</td>
                        <td className="align-middle text-nowrap">{session.price}</td>
                        <td className="align-middle text-nowrap">
                          <Form.Check id={`activationSwitch${session.id}`} type="switch" label="" checked={session.is_active} onChange={() => handleActivation(session.id, !session.is_active, () => setNeedReload(true))} />
                        </td>
                        <td className="align-middle text-nowrap">
                          <div className="d-flex">
                            <Link to={`/manage/session/${session.id}/audiance`}>
                              <Button variant="info" className="m-1 text-nowrap">
                                <PeopleFill size="1.25rem" />&nbsp;Audiance
                              </Button>
                            </Link>
                            {session.is_active
                              ? (
                                <>
                                  <OverlayTrigger overlay={<Tooltip>Deactivate the session first.</Tooltip>}>
                                    <span>
                                      <Button variant="primary" className="m-1 text-nowrap" style={{ pointerEvents: 'none' }} disabled>
                                        <PencilSquare size="1.25rem" />&nbsp;Edit
                                      </Button>
                                    </span>
                                  </OverlayTrigger>
                                  <OverlayTrigger overlay={<Tooltip>Deactivate the session first.</Tooltip>}>
                                    <span>
                                      <Button variant="danger" className="m-1 text-nowrap" style={{ pointerEvents: 'none' }} disabled>
                                        <TrashFill size="1.25rem" />&nbsp;Delete
                                      </Button>
                                    </span>
                                  </OverlayTrigger>
                                </>
                              )
                              : (
                                <>
                                  <Link to={`/manage/session/${session.id}/edit`}>
                                    <Button variant="primary" className="m-1 text-nowrap">
                                      <PencilSquare size="1.25rem" />&nbsp;Edit
                                    </Button>
                                  </Link>
                                  <Link to="#" onClick={() => handleDelete(session.id, () => setNeedReload(true))}>
                                    <Button variant="danger" className="m-1 text-nowrap">
                                      <TrashFill size="1.25rem" />&nbsp;Delete
                                    </Button>
                                  </Link>
                                </>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                  : (
                    <tr>
                      <td colSpan="7">
                        <Row className="p-3 text-center text-muted">
                          <Col>
                            <h6>No session currently.</h6>
                            <h6>Click the link below to create one.</h6>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  )}
                <tr>
                  <td colSpan="7">
                    <Link to={`/manage/session/create?event_id=${id}`} className="text-secondary">
                      <Plus size="1.25rem" />&nbsp;Create Session
                    </Link>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

function handleActivation(id, activation, reloadData) {
  swal.showLoading();
  const accessToken = getAccessToken();
  axios.post(`${BackendURL}/session/${id}/activation`, { activation }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(() => {
      reloadData();
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
    axios.delete(`${BackendURL}/session/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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

EventCardSession.propTypes = {
  show: PropTypes.bool,
  id: PropTypes.number,
};

EventCardSession.defaultProps = {
  show: false,
  id: null,
};
