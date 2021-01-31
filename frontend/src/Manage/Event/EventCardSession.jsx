import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, Table } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import swal from 'sweetalert2';

import BackendURL from 'BackendURL';

export default function EventCardSession(props) {
  const { show, id } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!show) {
      return;
    }
    swal.showLoading();
    axios.get(`${BackendURL}/session/?event_id=${id}`)
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
  }, [show]);

  return (
    <Card>
      <Container>
        <Row>
          <Col className="pl-0 pr-0">
            <Table striped bordered hover responsive className="mb-0 text-center" size="sm">
              <thead>
                <tr>
                  <th className="align-middle">Location</th>
                  <th className="align-middle">Time</th>
                  <th className="align-middle">Sell Open Time</th>
                  <th className="align-middle">Available Seats</th>
                  <th className="align-middle">Price</th>
                  <th className="align-middle">Activate</th>
                  <th className="align-middle">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((session) => {
                  const time = moment(session.time).format('lll');
                  const sellTimeOpen = moment(session.ticket_sell_time_open).format('lll');
                  const sellTimeEnd = moment(session.ticket_sell_time_End).format('lll');

                  return (
                    <tr key={session.id}>
                      <td className="align-middle">{session.address}</td>
                      <td className="align-middle">{time}</td>
                      <td className="align-middle"><span>{sellTimeOpen}</span> - <span>{sellTimeEnd}</span></td>
                      <td className="align-middle">{session.open_seats ? session.open_seats : '--'} / {session.max_seats}</td>
                      <td className="align-middle">{session.price}</td>
                      <td className="align-middle"><Form.Check id="custom-switch" type="switch" label="" checked={true} onChange="" /></td>
                      <td className="align-middle">
                        <div className="d-flex">
                          <Link to="#" onClick={() => props.showUserUpdateModal(user)} className="text-reset">
                            <Button variant="primary" className="m-1 text-nowrap">
                              <PencilSquare size="1.25rem" />{' '}Edit
                            </Button>
                          </Link>
                          <Link to="#" onClick={() => props.showUserUpdateModal(user)} className="text-reset">
                            <Button variant="danger" className="m-1 text-nowrap">
                              <TrashFill size="1.25rem" />{' '}Delete
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

EventCardSession.propTypes = {
  show: PropTypes.bool,
  id: PropTypes.number,
};

EventCardSession.defaultProps = {
  show: false,
  id: null,
};
