import React, { useEffect, useState } from 'react';
import { JournalCheck } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import SessionForm from 'SRC/commons/Form/SessionForm';
import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function Create() {
  const params = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.get(`${BackendURL}/session/${params.id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
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
    <SessionForm formTitle="Update Session" formSubmitBtnText={<><JournalCheck /> Update</>} name={data.name} address={data.address} time={data.time} eventStartDate={data.start_date} eventEndDate={data.end_date} sellTimeOpen={data.ticket_sell_time_open} sellTimeEnd={data.ticket_sell_time_end} maxSeats={`${data.max_seats}`} price={`${data.price}`} onSubmit={handleUpdate(params.id)} />
  );
}

function handleUpdate(id) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const { sellTimeOpen: ticket_sell_time_open, sellTimeEnd: ticket_sell_time_end, maxSeats: max_seats, ...others } = values;

    const accessToken = getAccessToken();
    axios.put(`${BackendURL}/session/${id}`, { ticket_sell_time_open, ticket_sell_time_end, max_seats, ...others }, { headers: { Authorization: `Bearer ${accessToken}` } })
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
