import React, { useEffect, useState } from 'react';
import { JournalPlus } from 'react-bootstrap-icons';
import { useHistory, useLocation } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import SessionForm from 'SRC/commons/SessionForm';
import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function Create() {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const eventId = query.get('event_id');
  const [data, setData] = useState({});

  useEffect(() => {
    swal.showLoading();
    axios.get(`${BackendURL}/event/${eventId}`)
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
  }, []);

  return (
    <SessionForm formTitle="Create Session" name={data.name} eventStartDate={data.start_date} eventEndDate={data.end_date} formSubmitBtnText={<><JournalPlus /> Create</>} onSubmit={handleCreate(eventId, () => history.replace('/manage/event'))} />
  );
}

function handleCreate(eventId, redirect) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const { sellTimeOpen: ticket_sell_time_open, sellTimeEnd: ticket_sell_time_end, maxSeats: max_seats, ...others } = values;

    const accessToken = getAccessToken();
    axios.post(`${BackendURL}/session?event_id=${eventId}`, { ticket_sell_time_open, ticket_sell_time_end, max_seats, ...others }, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        swal.fire({ icon: 'success', title: 'Success', text: 'You can view this session under the event session tab.' })
          .then(() => redirect());
      })
      .catch((error) => {
        setSubmitting(false);
        if (error.response && error.response.data) {
          const { error_msg: message = '' } = error.response.data;
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  };
}
