import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { EnvelopeFill, KeyFill, PersonBadge, PersonCheckFill } from 'react-bootstrap-icons';

import axios from 'axios';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import InputSelectGroup from 'SRC/commons/Input/InputSelectGroup';
import InputTextGroup from 'SRC/commons/Input/InputTextGroup';
import { getAccessToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function UpdateUserModal(props) {
  const { show, userId, name, email, role, hideModal, reloadData } = props;
  const roleOptions = [{ value: 1, text: 'Admin' }, { value: 2, text: 'Host' }, { value: 3, text: 'User' }];

  return (
    <Modal show={show} onHide={hideModal} size="md" centered>
      <Formik
        initialValues={{ name, email, role }}
        validate={handleValidation}
        onSubmit={handleUpdate(userId, hideModal, reloadData)}
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
              <Modal.Title id="contained-modal-title-vcenter">User Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputTextGroup label="Name" name="name" type="text" value={values.name} icon={<PersonBadge />} onChange={handleChange} onBlur={handleBlur} isInvalid={!!errors.name} errorMsg={errors.name} />
              <InputTextGroup label="Email" name="email" type="email" value={values.email} icon={<EnvelopeFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={!!errors.email} errorMsg={errors.email} />
              <InputSelectGroup label="Role" name="role" options={roleOptions} value={values.role} icon={<KeyFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={!!errors.role} errorMsg={errors.role} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" disabled={!dirty || isSubmitting} block><PersonCheckFill />{' '}Update</Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

function handleValidation(values) {
  const errors = {};

  if (!values.name) errors.name = 'Required';
  else if (values.name.length > 64) errors.name = 'Max length is 64 characters';

  if (!values.email) errors.email = 'Required';
  else if (values.email.length > 64) errors.email = 'Max length is 64 characters';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) errors.email = 'Invalid email address';

  if (!values.role) errors.role = 'Required';
  else if (!/^[1-3]$/.test(values.role)) errors.role = 'Not valid role';

  return errors;
}

function handleUpdate(userId, hideModal, reloadData) {
  return (values, { setSubmitting }) => {
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.put(`${BackendURL}/user/${userId}`, values, { headers: { Authorization: `Bearer ${accessToken}` } })
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

UpdateUserModal.propTypes = {
  show: PropTypes.bool,
  userId: PropTypes.number,
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  hideModal: PropTypes.func,
  reloadData: PropTypes.func,
};

UpdateUserModal.defaultProps = {
  show: false,
  userId: null,
  name: '',
  email: '',
  role: '',
  hideModal: () => {},
  reloadData: () => {},
};
