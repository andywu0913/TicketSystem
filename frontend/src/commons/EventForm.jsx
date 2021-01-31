import React from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { ArrowLeftShort } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import { Editor } from 'react-draft-wysiwyg';
import { useHistory } from 'react-router-dom';

import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Formik } from 'formik';
import htmlToDraft from 'html-to-draftjs';
import PropTypes from 'prop-types';

import InputTextGroup from 'SRC/commons/InputTextGroup';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './EventForm.css';

export default function EventForm(props) {
  const history = useHistory();
  const { formTitle, formSubmitBtnText, name, description, startDate, endDate, onSubmit } = props;
  const editorState = description ? html2editorState(description) : EditorState.createEmpty();
  return (
    <Container className="align-self-center mt-3 mb-3">
      <Row className="justify-content-md-center">
        <Col xs sm={12} md={10} lg={9} xl={8}>
          <Card>
            <Card.Body>
              <Formik
                initialValues={{ name, description, editorState, startDate: new Date(startDate), endDate: new Date(endDate) }}
                validate={handleValidation}
                onSubmit={(values, formikBag) => {
                  const { editorState, ...toSubmit } = values;
                  toSubmit.description = editorState2html(editorState);
                  onSubmit(toSubmit, formikBag);
                }}
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
                    <InputTextGroup label="Event Title" name="name" type="text" value={values.name} onChange={handleChange} isInvalid={touched.name && !!errors.name} errorMsg={errors.name} placeholder="Add Title" />
                    <Form.Label>Description</Form.Label>
                    <Editor
                      editorState={values.editorState}
                      toolbarClassName="toolbar-class editor-toolbar"
                      wrapperClassName="wrapper-class"
                      editorClassName="editor-class editor-content pl-3 pr-3"
                      onEditorStateChange={(editorState) => setFieldValue('editorState', editorState)}
                      placeholder="Add some description here..."
                    />
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
                    <Button variant="primary" type="submit" disabled={isSubmitting} block>{formSubmitBtnText}</Button>
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

function html2editorState(html) {
  const { contentBlocks, entityMap } = htmlToDraft(html);
  const contentState = ContentState.createFromBlockArray(contentBlocks);
  return EditorState.createWithContent(contentState);
}

function editorState2html(editorState) {
  const currentContent = editorState.getCurrentContent();
  return draftToHtml(convertToRaw(currentContent));
}

function handleValidation(values) {
  const errors = {};

  if (!values.name) errors.name = 'Required';
  else if (values.name.length >= 50) errors.name = 'Max length is 50 characters';

  if (values.startDate - values.endDate > 0) errors.date = 'Event start date is greater than end date.';

  return errors;
}

EventForm.propTypes = {
  formTitle: PropTypes.string,
  formSubmitBtnText: PropTypes.instanceOf(Object),
  name: PropTypes.string,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onSubmit: PropTypes.func,
};

EventForm.defaultProps = {
  formTitle: '',
  formSubmitBtnText: '',
  name: '',
  description: '',
  startDate: Date(),
  endDate: Date(),
  onSubmit: '',
};
