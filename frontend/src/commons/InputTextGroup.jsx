import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

function InputTextGroup(props) {
  const { label, name, type, value, icon, onChange, isValid, isInvalid, errorMsg, placeholder, readOnly } = props;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup className="mb-2">{isInvalid}
        <Form.Control
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          isValid={isValid}
          isInvalid={isInvalid}
          placeholder={placeholder || label}
          readOnly={readOnly}
        />
        {errorMsg && <Form.Control.Feedback type="invalid" tooltip>{errorMsg}</Form.Control.Feedback>}
        {icon && <InputGroup.Append><InputGroup.Text>{icon}</InputGroup.Text></InputGroup.Append>}
      </InputGroup>
    </Form.Group>
  );
}

InputTextGroup.propTypes = {
  label:       PropTypes.string,
  name:        PropTypes.string,
  type:        PropTypes.string,
  value:       PropTypes.string,
  icon:        PropTypes.instanceOf(Object),
  onChange:    PropTypes.func,
  isValid:     PropTypes.bool,
  isInvalid:   PropTypes.bool,
  errorMsg:    PropTypes.string,
  placeholder: PropTypes.string,
  readOnly:    PropTypes.bool,
};

InputTextGroup.defaultProps = {
  label:       '',
  name:        '',
  type:        '',
  value:       '',
  icon:        null,
  onChange:    () => {},
  isValid:     false,
  isInvalid:   false,
  errorMsg:    '',
  placeholder: null,
  readOnly:    false,
};

export default InputTextGroup;
