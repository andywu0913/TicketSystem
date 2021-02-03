import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { EnvelopeFill, LockFill, PersonBadge, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';
import { Formik } from 'formik';
import swal from 'sweetalert2';

import InputTextGroup from 'SRC/commons/Input/InputTextGroup';

import BackendURL from 'BackendURL';

export default function SignUp() {
  const history = useHistory();
  return (
    <Container className="align-self-center mt-3 mb-3">
      <Row className="justify-content-md-center">
        <Col xs sm={8} md={6} lg={5} xl={4}>
          <Card>
            <Card.Body>
              <Card.Text className="text-center text-secondary">Sign up with a new account</Card.Text>
              <Formik
                initialValues={{ uname: '', password: '', passwordConfirm: '', name: '', email: '' }}
                validate={handleValidation}
                onSubmit={handleSignUp(() => history.push('/user/signin'))}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <InputTextGroup label="Username" name="uname" type="text" value={values.uname} icon={<PersonFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.uname && !!errors.uname} errorMsg={errors.uname} />
                    <InputTextGroup label="Password" name="password" type="password" value={values.password} icon={<LockFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.password && !!errors.password} errorMsg={errors.password} />
                    <InputTextGroup label="Confirm Password" name="passwordConfirm" type="password" value={values.passwordConfirm} icon={<LockFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.passwordConfirm && !!errors.passwordConfirm} errorMsg={errors.passwordConfirm} />
                    <InputTextGroup label="Nickname" name="name" type="text" value={values.name} icon={<PersonBadge />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.name && !!errors.name} errorMsg={errors.name} />
                    <InputTextGroup label="Email" name="email" type="email" value={values.email} icon={<EnvelopeFill />} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.email && !!errors.email} errorMsg={errors.email} />
                    <br />
                    <Button variant="primary" type="submit" disabled={isSubmitting} block><PersonPlusFill />{' '}Sign Up</Button>
                  </Form>
                )}
              </Formik>
              <hr />
              <Card.Text className="text-center text-secondary">Already have an account? <Link to="/user/signin">Sign in</Link> now!</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function handleValidation(values) {
  const errors = {};

  if (!values.uname) errors.uname = 'Required';
  else if (values.uname.trim().length < 4) errors.uname = 'Min length is 4 characters';
  else if (values.uname.length > 64) errors.uname = 'Max length is 64 characters';
  else if (!/^[A-Z0-9._%+-]{4,16}$/i.test(values.uname)) errors.uname = 'Only alphanumeric and . _ % + - are allowed';

  if (!values.password) errors.password = 'Required';
  else if (values.password.trim().length < 4) errors.password = 'Min length is 4 characters';

  if (!values.passwordConfirm) errors.passwordConfirm = 'Required';
  else if (values.passwordConfirm.trim().length < 4) errors.passwordConfirm = 'Min length is 4 characters';

  if (values.password !== values.passwordConfirm) errors.password = errors.passwordConfirm = 'Both not matching';

  if (!values.name) errors.name = 'Required';
  else if (values.name.length > 64) errors.name = 'Max length is 64 characters';

  if (!values.email) errors.email = 'Required';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) errors.email = 'Invalid email address';

  return errors;
}

function handleSignUp(redirect) {
  return (values, { setSubmitting, setFieldError }) => {
    swal.showLoading();
    axios.post(`${BackendURL}/user/`, values)
      .then(() => {
        swal.fire({ icon: 'success', title: 'Success', text: 'You can now sign in with your new account.' })
          .then(() => redirect());
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
  };
}
