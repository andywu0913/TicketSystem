import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { BoxArrowInRight, Github, LockFill, PersonFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { Formik } from 'formik';
import { GitHub } from 'OAuth';
import swal from 'sweetalert2';

import InputTextGroup from 'SRC/commons/Input/InputTextGroup';
import { saveAccessToken, saveExpiration, saveRefreshToken } from 'SRC/utils/jwt';

import BackendURL from 'BackendURL';

export default function SignIn() {
  return (
    <Container className="align-self-center mt-3 mb-3">
      <Row className="justify-content-md-center">
        <Col xs sm={8} md={6} lg={5} xl={4}>
          <Card>
            <Card.Body>
              <Card.Text className="text-center text-secondary">Sign in to start your session</Card.Text>
              <Formik
                initialValues={{ uname: '', password: '' }}
                validate={handleValidation}
                onSubmit={handleSignIn}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group>
                      <InputTextGroup label="Username" name="uname" type="text" value={values.uname} icon={<PersonFill />} onChange={handleChange} isInvalid={!!errors.uname} />
                    </Form.Group>
                    <Form.Group>
                      <InputTextGroup label="Password" name="password" type="password" value={values.password} icon={<LockFill />} onChange={handleChange} isInvalid={!!errors.password} />
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit" disabled={isSubmitting} block><BoxArrowInRight />{' '}Sign In</Button>

                    <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                    <Button variant="secondary" onClick={handleSignInGithub} block><Github />{' '}Sign In with GitHub</Button>
                  </Form>
                )}
              </Formik>
              <hr />
              <Card.Text className="text-center text-secondary">Don&apos;t have an account? <Link to="/user/signup">Sign up</Link> now!</Card.Text>
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
  if (!values.password) errors.password = 'Required';
  return errors;
}

function handleSignIn(values, { setSubmitting, setFieldError }) {
  swal.showLoading();
  axios.post(`${BackendURL}/user/login`, values)
    .then((response) => {
      const { data } = response.data;
      saveAccessToken(data.access_token);
      saveRefreshToken(data.refresh_token);
      saveExpiration(data.expires_in);

      swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
        .then(() => window.location.replace('/'));
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

function handleSignInGithub() {
  swal.showLoading();
  const clientId = GitHub.CLIENT_ID;
  const scope = GitHub.SCOPE;
  const url = GitHub.REQUEST_AUTHORIZATION_URL;
  window.location.href = `${url}?client_id=${clientId}&scope=${scope}`;
}
