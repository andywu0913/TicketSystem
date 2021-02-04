import React, { useEffect, useState } from 'react';
import { CalendarCheck } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import EventForm from 'SRC/commons/Form/EventForm';
import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function Create() {
  const params = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    swal.showLoading();
    axios.get(`${BackendURL}/event/${params.id}`)
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
    <EventForm
      formTitle="Update Event"
      formSubmitBtnText={<><CalendarCheck />Update</>}
      name={data.name}
      description={data.description}
      startDate={data.start_date}
      endDate={data.end_date}
      onSubmit={handleUpdate(params.id)}
    />
  );
}

function handleUpdate(id) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const { startDate: start_date, endDate: end_date, ...others } = values;

    const accessToken = getAccessToken();
    axios.put(`${BackendURL}/event/${id}`, { start_date, end_date, ...others }, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
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
        setSubmitting(false);
      });
  };
}
