import React from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';

import axios from 'axios';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function UpdateTicketModal(props) {
  const { ticketId, seat, show, hideModal, reloadData } = props;

  return (
    <Modal show={show} onHide={hideModal} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Seat Selection</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ seat }}
        validate={handleValidation}
        onSubmit={handleUpdate(ticketId, reloadData, hideModal)}
        enableReinitialize
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          dirty,
          isSubmitting,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Modal.Body>
              <Container>
                <Row>
                  <Col><p>Change seat to</p></Col>
                </Row>
                <Row>
                  <Col className="align-self-center text-center">
                    <Form.Group>
                      <InputGroup>
                        <FormControl type="text" name="seat" size="lg" value={values.seat} onChange={handleChange} onBlur={handleBlur} isInvalid={!!errors.seat} />
                        <Form.Control.Feedback type="invalid" tooltip>{errors.seat}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => handleDelete(ticketId, reloadData, hideModal)}>Delete ticket</Button>
              <Button variant="primary" type="submit" disabled={!dirty || isSubmitting}>Update seat</Button>
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

function handleUpdate(ticketId, reloadData, hideModal) {
  return (values, { setSubmitting }) => {
    const accessToken = getAccessToken();
    axios.put(`${BackendURL}/ticket/${ticketId}`, { seat_no: values.seat }, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        hideModal();
        swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => reloadData());
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

function handleDelete(ticketId, reloadData, hideModal) {
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
    axios.delete(`${BackendURL}/ticket/${ticketId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(() => {
        hideModal();
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

UpdateTicketModal.propTypes = {
  show: PropTypes.bool,
  ticketId: PropTypes.number,
  seat: PropTypes.number,
  hideModal: PropTypes.func,
  reloadData: PropTypes.func,
};

UpdateTicketModal.defaultProps = {
  show: false,
  ticketId: PropTypes.number,
  seat: PropTypes.number,
  hideModal: () => {},
  reloadData: () => {},
};
