import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CalendarPlus } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import axios from 'axios';
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
    const userId = getUserId();
    const accessToken = getAccessToken();
    axios.get(`${BackendURL}/event/creator/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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

  function deleteEvent(id) {
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
      axios.delete(`${BackendURL}/event/${id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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
          <div className="d-flex justify-content-between">
            <h1 className="text-dark">My Events</h1>
            <h2 className="pt-2">
              <Link to="/manage/event/create" className="text-reset">
                <Button variant="outline-primary" className="text-nowrap">
                  <CalendarPlus size="1.25rem" />&nbsp;Create
                </Button>
              </Link>
            </h2>
          </div>
          <hr />
        </Col>
      </Row>
      {data.length > 0
        ? data.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.name}
            description={event.description}
            startDate={event.start_date}
            endDate={event.end_date}
            reloadData={() => setNeedReload(true)}
            deleteEvent={deleteEvent}
          />
        ))
        : (
          <Row className="m-5 p-5 text-center text-muted">
            <Col>
              <h6>You haven&apos;t create any event yet.</h6>
            </Col>
          </Row>
        )}
    </Container>
  );
}
