import React, { Component } from 'react';
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import { CalendarPlus, ArrowLeftShort } from 'react-bootstrap-icons';
import { Formik } from 'formik';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

export default class extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  handleSubmit(values, { setSubmitting }) {
    const { name, description, startDate, endDate } = values;

    const self = this;
    const accessToken = getAccessToken();
    Axios.post('http://localhost:3000/api/event/', { name, description, start_date: startDate, end_date: endDate }, { headers: {
      Authorization: `Bearer ${accessToken}`,
    } }).then((response) => {
      const { data } = response.data;

      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
    }).catch((error) => {
      setSubmitting(false);
      if (error.response && error.response.data) {
        const message = error.response.data.error_msg || '';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
  }

  goBack() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs sm={12} md={9} lg={8} xl={6}>
            <Card>
              <Card.Body>
                <Formik
                  initialValues={{ name: '', description: '', startDate: '', endDate: '' }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.name) errors.name = 'Required';
                    if (values.name.length >= 50) errors.name = 'Max length is 50 characters';
                    if (!values.description) errors.description = 'Required';
                    if (!values.startDate) errors.startDate = 'Required';
                    if (values.startDate.length >= 50) errors.startDate = 'Invalid date format'; //TODO
                    if (!values.endDate) errors.endDate = 'Required';
                    if (values.endDate.length >= 50) errors.endDate = 'Invalid date format'; //TODO
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
                      <h2 className="text-dark mb-3">Create Event</h2>
                      <Form.Group>
                        <Form.Label>Event Title</Form.Label>
                        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} isInvalid={touched.name && !!errors.name} placeholder="Add title" />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" name="description" value={values.description} onChange={handleChange} isInvalid={touched.description && !!errors.description} placeholder="Add some description here..." rows={5} />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Label>Event Period</Form.Label>
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Control type="text" name="startDate" value={values.startDate} onChange={handleChange} isInvalid={touched.startDate && !!errors.startDate} placeholder="Start" />
                            <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={1}>~</Col>
                        <Col>
                          <Form.Group>
                            <Form.Control type="text" name="endDate" value={values.endDate} onChange={handleChange} isInvalid={touched.endDate && !!errors.endDate} placeholder="End" />
                            <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <hr />
                      <Button variant="primary" type="submit" disabled={isSubmitting} block><CalendarPlus />{' '}Create</Button>
                      <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                      <Button variant="secondary" onClick={this.goBack} block><ArrowLeftShort />{' '}Go Back</Button>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
