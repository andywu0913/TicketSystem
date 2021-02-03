import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Check2, EaselFill } from 'react-bootstrap-icons';

import axios from 'axios';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import InputTextGroup from 'SRC/commons/Input/InputTextGroup';
import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function BookTicketModal(props) {
  const { show, sessionId, address, time, price, openSeats, seat, hideModal, redirect } = props;

  return (
    <Modal show={show} onHide={hideModal} size="md" centered>
      <Formik
        initialValues={{ seat }}
        validate={handleValidation}
        onSubmit={handleCreate(sessionId, redirect)}
        enableReinitialize
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">{address}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Time: {time}</p>
              <p>Price: {price}</p>
              <p>Available seats left: {openSeats}</p>
              <InputTextGroup label="Seat No" name="seat" type="text" value={values.seat} icon={<EaselFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={!!errors.seat} errorMsg={errors.seat} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" disabled={isSubmitting} block><Check2 />{' '}Book</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

function handleValidation(values) {
  const errors = {};

  if (!values.seat) errors.seat = 'Required';
  else if (!/^[0-9]+$/.test(values.seat)) errors.seat = 'Not valid number';

  return errors;
}

function handleCreate(id, redirect) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.post(`${BackendURL}/ticket/?session_id=${id}`, { seat_no: values.seat }, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => redirect());
      })
      .catch((error) => {
        setSubmitting(false);
        if (error.response && error.response.data) {
          const message = error.response.data.error_msg || '';
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  };
}

BookTicketModal.propTypes = {
  show: PropTypes.bool,
  sessionId: PropTypes.number,
  address: PropTypes.string,
  time: PropTypes.string,
  price: PropTypes.string,
  openSeats: PropTypes.string,
  seat: PropTypes.string,
  hideModal: PropTypes.func,
  redirect: PropTypes.func,
};

BookTicketModal.defaultProps = {
  show: false,
  sessionId: null,
  address: '',
  time: '',
  price: '',
  openSeats: '',
  seat: '',
  hideModal: () => {},
  redirect: () => {},
};
