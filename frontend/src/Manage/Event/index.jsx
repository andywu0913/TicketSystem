import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CalendarPlus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';

import { getAccessToken, getUserId } from 'SRC/utils/jwt';

import EventCard from './EventCard';

import BackendURL from 'BackendURL';

export default function Event() {
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);

  useEffect(() => {
    if (!needReload) {
      return;
    }

    swal.showLoading();
    const accessToken = getAccessToken();
    const userId = getUserId();
    axios.get(`${BackendURL}/event/creator/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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

  return (
    <Container className="p-3">
      <Row>
        <Col>
          <div className="d-flex justify-content-between">
            <h1 className="text-dark">My Events</h1>
            <h2 className="pt-2">
              <Link to="/manage/event/create" className="text-reset">
                <Button variant="outline-primary" className="text-nowrap">
                  <CalendarPlus size="1.25rem" />{' '}Create
                </Button>
              </Link>
            </h2>
          </div>
          <hr />
        </Col>
      </Row>
      {data.length ? renderEventCardList(data, () => setNeedReload(true)) : renderEmpty()}
    </Container>
  );
}

function renderEventCardList(data, reloadData) {
  const events = data.map((event) => {
    let { id, name, description, start_date: startDate, end_date: endDate } = event;
    description = description.replace(/(<([^>]+)>)/gi, '');
    startDate = moment(startDate).format('ll');
    endDate = moment(endDate).format('ll');

    return <EventCard key={id} id={id} name={name} description={description} startDate={startDate} endDate={endDate} reloadData={reloadData} />;
  });
  return <>{events}</>;
}

function renderEmpty() {
  return (
    <Row className="m-5 p-5 text-center text-muted">
      <Col>
        <h6>You haven&apos;t create any event yet.</h6>
      </Col>
    </Row>
  );
}
