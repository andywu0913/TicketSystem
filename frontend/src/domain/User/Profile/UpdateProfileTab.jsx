import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { EnvelopeFill, KeyFill, PersonBadge, PersonCheckFill, PersonFill } from 'react-bootstrap-icons';

import axios from 'axios';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

import InputTextGroup from 'SRC/commons/Input/InputTextGroup';
import { getAccessToken, renew } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function UpdateProfileTab(props) {
  const { user } = props;
  return (
    <Card>
      <Card.Body>
        <Card.Text className="text-center text-secondary">Update Profile</Card.Text>
        <Formik
          initialValues={user}
          validate={handleValidation}
          onSubmit={handleUpdate}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            dirty,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <InputTextGroup label="Username" name="uname" type="text" value={values.uname} icon={<PersonFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.uname && !!errors.uname} errorMsg={errors.uname} readOnly={!!values.github_id} />
              <InputTextGroup label="Nickname" name="name" type="text" value={values.name} icon={<PersonBadge />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.name && !!errors.name} errorMsg={errors.name} />
              <InputTextGroup label="Email" name="email" type="email" value={values.email} icon={<EnvelopeFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.email && !!errors.email} errorMsg={errors.email} />
              <InputTextGroup label="Role" name="rname" type="text" value={values.rname} icon={<KeyFill />} readOnly />
              <br />
              <Button variant="primary" type="submit" disabled={!dirty || isSubmitting} block><PersonCheckFill />{' '}Update</Button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
}

function handleValidation(values) {
  const errors = {};

  if (!values.uname) errors.uname = 'Required';
  else if (values.uname.trim().length < 4) errors.uname = 'Min length is 4 characters';
  else if (values.uname.length > 64) errors.uname = 'Max length is 64 characters';
  else if (!/^[A-Z0-9._%+-]{4,16}$/i.test(values.uname)) errors.uname = 'Only alphanumeric and . _ % + - are allowed';
  if (values.github_id) delete errors.uname;

  if (!values.name) errors.name = 'Required';
  else if (values.name.length > 64) errors.name = 'Max length is 64 characters';

  if (!values.email) errors.email = 'Required';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) errors.email = 'Invalid email address';

  return errors;
}

function handleUpdate(values, { setSubmitting, setFieldError }) {
  swal.showLoading();
  const accessToken = getAccessToken();
  axios.put(`${BackendURL}/user`, values, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(() => {
      renew(() => {
        swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => window.location.reload());
      });
    })
    .catch((error) => {
      setSubmitting(false);
      if (error.response && error.response.data) {
        const { error_msg: message = '', error_field: fields } = error.response.data;
        fields.forEach((field) => setFieldError(field, message));
        swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
}

UpdateProfileTab.propTypes = {
  user: PropTypes.instanceOf(Object),
};

UpdateProfileTab.defaultProps = {
  user: {},
};
