import React from 'react';
import { CalendarPlus } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import EventForm from 'SRC/commons/Form/EventForm';
import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function Create() {
  const history = useHistory();
  return (
    <EventForm formTitle="Create Event" formSubmitBtnText={<><CalendarPlus /> Create</>} onSubmit={handleCreate(() => history.replace('/manage/event'))} />
  );
}

function handleCreate(redirect) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const { startDate: start_date, endDate: end_date, ...others } = values;

    const accessToken = getAccessToken();
    axios.post(`${BackendURL}/event/`, { start_date, end_date, ...others }, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        swal.fire({ icon: 'success', title: 'Success', text: 'You can start adding some sessions to this event.' })
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
