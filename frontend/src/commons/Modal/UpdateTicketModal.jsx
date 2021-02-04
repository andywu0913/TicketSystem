import React from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';
import { Check2Square } from 'react-bootstrap-icons';

import axios from 'axios';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

function UpdateTicketModal(props) {
  const { show, ticketId, seatNo, hideModal, reloadData } = props;

  return (
    <Modal show={show} onHide={hideModal} size="sm" centered>
      <Formik
        initialValues={{ seatNo }}
        validate={handleValidation}
        onSubmit={handleUpdate(ticketId, hideModal, reloadData)}
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
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">Seat Selection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <Row>
                  <Col><p>Change seat to</p></Col>
                </Row>
                <Row>
                  <Col className="align-self-center text-center">
                    <Form.Group>
                      <InputGroup>
                        <FormControl
                          type="text"
                          name="seatNo"
                          size="lg"
                          value={values.seatNo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={!!errors.seatNo}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>{errors.seatNo}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" disabled={!dirty || isSubmitting}>
                <Check2Square size="1.25rem" />&nbsp;Update seat
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

function handleValidation(values) {
  const errors = {};

  if (!values.seatNo) errors.seatNo = 'Required';
  else if (!/^[0-9]+$/.test(values.seatNo)) errors.seatNo = 'Not valid number';

  return errors;
}

function handleUpdate(ticketId, hideModal, reloadData) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.put(`${BackendURL}/ticket/${ticketId}`, { seat_no: values.seatNo }, { headers: { Authorization: `Bearer ${accessToken}` } })
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

UpdateTicketModal.propTypes = {
  show: PropTypes.bool,
  ticketId: PropTypes.number,
  seatNo: PropTypes.string,
  hideModal: PropTypes.func,
  reloadData: PropTypes.func,
};

UpdateTicketModal.defaultProps = {
  show: false,
  ticketId: null,
  seatNo: '',
  hideModal: () => {},
  reloadData: () => {},
};

export default UpdateTicketModal;
