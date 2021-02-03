import React from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeftShort } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';

import { Formik } from 'formik';
import PropTypes from 'prop-types';

import InputTextGroup from 'SRC/commons/Input/InputTextGroup';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function SessionForm(props) {
  const history = useHistory();
  const { formTitle, name, address, time, eventStartDate, eventEndDate, sellTimeOpen, sellTimeEnd, maxSeats, price, formSubmitBtnText, onSubmit } = props;
  return (
    <Container className="align-self-center mt-3 mb-3">
      <Row className="justify-content-md-center">
        <Col xs sm={12} md={10} lg={9} xl={8}>
          <Card>
            <Card.Body>
              <Formik
                initialValues={{
                  address,
                  time: new Date(time || eventEndDate),
                  sellTimeOpen: new Date(sellTimeOpen || eventStartDate),
                  sellTimeEnd: new Date(sellTimeEnd || eventEndDate),
                  maxSeats,
                  price,
                }}
                validate={handleValidation}
                onSubmit={onSubmit}
                enableReinitialize
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
                    <h2 className="text-dark mb-3">{formTitle}</h2>
                    <hr />
                    <h3 className="text-dark mb-3">{name}</h3>
                    <InputTextGroup
                      label="Location"
                      name="address"
                      type="text"
                      value={values.address}
                      onChange={handleChange}
                      isInvalid={touched.address && !!errors.address}
                      errorMsg={errors.address}
                      placeholder="Add session address"
                    />
                    <Form.Label>Time</Form.Label>
                    <Row>
                      <Col>
                        <Form.Group>
                          <DatePicker
                            name="time"
                            className="form-control"
                            selected={values.time}
                            onChange={(date) => setFieldValue('time', date || new Date())}
                            minDate={new Date(eventStartDate)}
                            maxDate={new Date(eventEndDate)}
                            dateFormat="yyyy-MM-dd HH:mm"
                            showTimeSelect
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Label>Sell Open Time</Form.Label>
                    <Row>
                      <Col>
                        <Form.Group>
                          <DatePicker
                            name="sellTimeOpen"
                            className="form-control"
                            selected={values.sellTimeOpen}
                            onChange={(date) => setFieldValue('sellTimeOpen', date || new Date())}
                            startDate={values.sellTimeOpen}
                            endDate={values.sellTimeEnd}
                            minDate={new Date(eventStartDate)}
                            maxDate={new Date(eventEndDate)}
                            dateFormat="yyyy-MM-dd HH:mm"
                            selectsStart
                            showTimeInput
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1} className="align-self-center justify-content-md-center text-center">
                        <Form.Group>~</Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <DatePicker
                            name="sellTimeEnd"
                            className="form-control"
                            selected={values.sellTimeEnd}
                            onChange={(date) => setFieldValue('sellTimeEnd', date || new Date())}
                            startDate={values.sellTimeOpen}
                            endDate={values.sellTimeEnd}
                            minDate={new Date(eventStartDate)}
                            maxDate={new Date(eventEndDate)}
                            dateFormat="yyyy-MM-dd HH:mm"
                            selectsEnd
                            showTimeInput
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {errors.date && <Alert variant="danger">{errors.date}</Alert> }
                    <InputTextGroup
                      label="Total Seats"
                      name="maxSeats"
                      type="number"
                      value={`${values.maxSeats}`}
                      min="0"
                      onChange={handleChange}
                      isInvalid={touched.maxSeats && !!errors.maxSeats}
                      errorMsg={errors.maxSeats}
                      placeholder="Add max seats for this session"
                    />
                    <InputTextGroup
                      label="Price"
                      name="price"
                      type="number"
                      value={`${values.price}`}
                      min="0"
                      onChange={handleChange}
                      isInvalid={touched.price && !!errors.price}
                      errorMsg={errors.price}
                      placeholder="Add ticket price for this session"
                    />
                    <hr />
                    <Button variant="primary" type="submit" disabled={isSubmitting} block>{formSubmitBtnText}</Button>
                    <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                    <Button variant="secondary" onClick={() => history.goBack()} block><ArrowLeftShort />&nbsp;Go Back</Button>
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

  if (!values.address) errors.address = 'Required';
  else if (values.address.length >= 64) errors.address = 'Max length is 64 characters';

  if (values.sellTimeOpen - values.sellTimeEnd > 0) errors.date = 'Session start date is greater than end date.';

  if (!values.maxSeats) errors.maxSeats = 'Required';

  if (!values.price) errors.price = 'Required';

  return errors;
}

SessionForm.propTypes = {
  formTitle: PropTypes.string,
  name: PropTypes.string,
  address: PropTypes.string,
  time: PropTypes.string,
  eventStartDate: PropTypes.string,
  eventEndDate: PropTypes.string,
  sellTimeOpen: PropTypes.string,
  sellTimeEnd: PropTypes.string,
  maxSeats: PropTypes.string,
  price: PropTypes.string,
  formSubmitBtnText: PropTypes.instanceOf(Object),
  onSubmit: PropTypes.func,
};

SessionForm.defaultProps = {
  formTitle: '',
  name: '',
  address: '',
  time: '',
  eventStartDate: Date(),
  eventEndDate: Date(),
  sellTimeOpen: '',
  sellTimeEnd: '',
  maxSeats: '',
  price: '',
  formSubmitBtnText: null,
  onSubmit: () => {},
};

export default SessionForm;
