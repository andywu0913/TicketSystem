import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { PersonCheckFill, LockFill } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import axios from 'axios';
import swal from 'sweetalert2';

import BackendURL from 'BackendURL';

import { getAccessToken } from 'SRC/utils/jwt';

import InputTextGroup from 'SRC/commons/InputTextGroup';

export default function UpdatePasswordTab(props) {
  const [allowUpdate, setAllowUpdate] = useState(true);

  useEffect(() => {
    setAllowUpdate(props.allowUpdate);
  }, [props]);

  return (
    <Card>
      <Card.Body>
        <Card.Text className="text-center text-secondary">Update Password</Card.Text>
        <Formik
          initialValues={{ password: '', passwordNew: '', passwordNewConfirm: '' }}
          validate={allowUpdate ? handleValidation : null}
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
              <InputTextGroup label="Current Password" name="password" type="password" value={values.password} icon={<LockFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.password && !!errors.password} errorMsg={errors.password} readOnly={!allowUpdate} />
              <hr />
              <InputTextGroup label="New Password" name="passwordNew" type="password" value={values.passwordNew} icon={<LockFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.passwordNew && touched.passwordNewConfirm && !!errors.passwordNew} errorMsg={errors.passwordNew} readOnly={!allowUpdate} />
              <InputTextGroup label="Confirm New Password" name="passwordNewConfirm" type="password" value={values.passwordNewConfirm} icon={<LockFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.passwordNew && touched.passwordNewConfirm && !!errors.passwordNewConfirm} errorMsg={errors.passwordNewConfirm} readOnly={!allowUpdate} />
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

  if (!values.password) errors.password = 'Required';

  if (!values.passwordNew) errors.passwordNew = 'Required';
  else if (values.passwordNew.trim().length < 4) errors.passwordNew = 'Min length is 4 characters';

  if (!values.passwordNewConfirm) errors.passwordNewConfirm = 'Required';
  else if (values.passwordNewConfirm.trim().length < 4) errors.passwordNewConfirm = 'Min length is 4 characters';

  if (values.passwordNew !== values.passwordNewConfirm) errors.passwordNew = errors.passwordNewConfirm = 'Both not matching';

  return errors;
}

function handleUpdate(values, { resetForm, setFieldError }) {
  swal.showLoading();
  const accessToken = getAccessToken();
  axios.put(`${BackendURL}/user/password`, { password_current: values.password, password_new: values.passwordNew }, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(() => {
      resetForm();
      swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { error_msg: message = '', error_field: fields } = error.response.data;

        if (fields.includes('password_current')) {
          setFieldError('password', message);
        }
        if (fields.includes('password_new')) {
          setFieldError('passwordNew', message);
          setFieldError('passwordNewConfirm', message);
        }
        swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
}

UpdatePasswordTab.propTypes = {
  allowUpdate: PropTypes.bool,
};

UpdatePasswordTab.defaultProps = {
  allowUpdate: true,
};
