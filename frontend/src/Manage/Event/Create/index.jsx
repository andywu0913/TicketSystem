import React from 'react';
import { useHistory } from 'react-router-dom';
import { CalendarPlus } from 'react-bootstrap-icons';
import axios from 'axios';
import swal from 'sweetalert2';

import BackendURL from 'BackendURL';

import { getAccessToken } from 'SRC/utils/jwt';

import EventForm from 'SRC/commons/EventForm';

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
        swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
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
