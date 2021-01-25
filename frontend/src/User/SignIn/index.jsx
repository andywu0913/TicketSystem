import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { BoxArrowInRight, Github, LockFill, PersonFill } from 'react-bootstrap-icons';
import { Formik } from 'formik';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { GitHub } from 'OAuth';

import InputTextGroup from 'SRC/commons/InputTextGroup';

import { saveAccessToken, saveRefreshToken, saveExpiration } from 'SRC/utils/jwt';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signInGithub = this.signInGithub.bind(this);
  }

  handleSubmit(values, { setSubmitting, setFieldError }) {
    Swal.showLoading();
    Axios.post('http://localhost:3000/api/user/login', values)
      .then((response) => {
        const { data } = response.data;
        saveAccessToken(data.access_token);
        saveRefreshToken(data.refresh_token);
        saveExpiration(data.expires_in);

        Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => window.location.replace('/'));
      })
      .catch((error) => {
        setSubmitting(false);
        if (error.response && error.response.data) {
          const { error_msg: message = '', error_field: fields } = error.response.data;
          fields.forEach((field) => setFieldError(field, message));
          Swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  signInGithub() {
    const clientId = GitHub.CLIENT_ID;
    const scope = GitHub.SCOPE;
    const url = GitHub.REQUEST_AUTHORIZATION_URL;
    window.location.href = `${url}?client_id=${clientId}&scope=${scope}`;
  }

  render() {
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs sm={8} md={6} lg={5} xl={4}>
            <Card>
              <Card.Body>
                <Card.Text className="text-center text-secondary">Sign in to start your session</Card.Text>
                <Formik
                  initialValues={{ uname: '', password: '' }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.uname) errors.uname = 'Required';
                    if (!values.password) errors.password = 'Required';
                    return errors;
                  }}
                  onSubmit={this.handleSubmit}
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
                        <InputTextGroup label="Username" name="uname" type="text" value={values.uname} icon={<PersonFill />} onChange={handleChange} isInvalid={touched.uname && !!errors.uname} />
                      </Form.Group>
                      <Form.Group>
                        <InputTextGroup label="Password" name="password" type="password" value={values.password} icon={<LockFill />} onChange={handleChange} isInvalid={touched.password && !!errors.password} />
                      </Form.Group>
                      <br />
                      <Button variant="primary" type="submit" disabled={isSubmitting} block><BoxArrowInRight />{' '}Sign In</Button>

                      <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                      <Button variant="secondary" onClick={this.signInGithub} block><Github />{' '}Sign In with GitHub</Button>
                    </Form>
                  )}
                </Formik>
                <hr />
                <Card.Text className="text-center text-secondary">Don't have an account? <Link to="/user/signup">Sign up</Link> now!</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignIn;
