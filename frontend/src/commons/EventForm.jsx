import React from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import { CalendarPlus, ArrowLeftShort } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import { Formik } from 'formik';

import InputTextGroup from 'SRC/commons/InputTextGroup';

import 'react-datepicker/dist/react-datepicker.css';
import './EventForm.css';

export default function EventForm(props) {
  const history = useHistory();
  return (
    <Container className="align-self-center mt-3 mb-3">
      <Row className="justify-content-md-center">
        <Col xs sm={12} md={9} lg={8} xl={6}>
          <Card>
            <Card.Body>
              <Formik
                initialValues={{ name: '', description: '', startDate: new Date(), endDate: new Date() }}
                validate={handleValidation}
                onSubmit={props.onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <h2 className="text-dark mb-3">Create Event</h2>
                    <InputTextGroup label="Event Title" name="name" type="text" value={values.name} onChange={handleChange} isInvalid={touched.name && !!errors.name} errorMsg={errors.name} placeholder="Add Title" />
                    <InputTextGroup as="textarea" rows={5} label="Description" name="description" type="textarea" value={values.description} onChange={handleChange} isInvalid={touched.description && !!errors.description} errorMsg={errors.description} placeholder="Add some description here..." />
                    <Form.Label>Event Period</Form.Label>
                    <Row>
                      <Col>
                        <Form.Group>
                          <DatePicker name="startDate" className="form-control" selected={values.startDate} onChange={(date) => setFieldValue('startDate', date || new Date())} selectsStart startDate={values.startDate} endDate={values.endDate} dateFormat="yyyy-MM-dd" />
                        </Form.Group>
                      </Col>
                      <Col md={1} className="align-self-center justify-content-md-center text-center">
                        <Form.Group>~</Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <DatePicker name="endDate" className="form-control" selected={values.endDate} onChange={(date) => setFieldValue('endDate', date || new Date())} selectsEnd startDate={values.startDate} endDate={values.endDate} minDate={values.startDate} dateFormat="yyyy-MM-dd" />
                        </Form.Group>
                      </Col>
                    </Row>
                    {errors.date && <Alert variant="danger">{errors.date}</Alert> }
                    <hr />
                    <Button variant="primary" type="submit" disabled={isSubmitting} block><CalendarPlus />{' '}Create</Button>
                    <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                    <Button variant="secondary" onClick={() => history.goBack()} block><ArrowLeftShort />{' '}Go Back</Button>
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

function handleValidation(values) {
  const errors = {};

  if (!values.name) errors.name = 'Required';
  else if (values.name.length >= 50) errors.name = 'Max length is 50 characters';

  if (!values.description) errors.description = 'Required';

  if (values.startDate - values.endDate > 0) errors.date = 'Event start date is greater than end date.';

  return errors;
}
