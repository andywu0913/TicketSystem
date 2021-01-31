import React, { useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import EventCardInfo from './EventCardInfo';
import EventCardSession from './EventCardSession';

import BackendURL from 'BackendURL';

export default function EventCard(props) {
  const [tab, seTab] = useState('info');
  const { id, name, description, startDate, endDate, reloadData } = props;

  return (
    <Row className="mb-5">
      <Col>
        <Tabs activeKey={tab} onSelect={seTab} className="border-bottom-0">
          <Tab eventKey="info" title="Info">
            <EventCardInfo id={id} name={name} description={description} startDate={startDate} endDate={endDate} />
          </Tab>
          <Tab eventKey="session" title="Session" tabClassName="mr-auto">
            <EventCardSession show={tab === 'session'} id={id} />
          </Tab>
          <Tab eventKey="modify" title={<PencilSquare className="text-muted" size="1.25rem" />}>
            {tab === 'modify' && <Redirect push to={`/manage/event/${id}/edit`} />}
          </Tab>
          <Tab title={<TrashFill className="text-muted" size="1.25rem" onClick={() => handleDelete(id, reloadData)} />} />
        </Tabs>
      </Col>
    </Row>
  );
}

function handleDelete(event, reloadData) {
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
    axios.delete(`${BackendURL}/event/${event}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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

EventCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  reloadData: PropTypes.func,
};

EventCard.defaultProps = {
  id: null,
  name: null,
  description: null,
  startDate: null,
  endDate: null,
  reloadData: () => {},
};
