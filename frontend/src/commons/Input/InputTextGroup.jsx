import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import PropTypes from 'prop-types';

export default function InputTextGroup(props) {
  const { label, name, type, value, icon, onChange, onBlur, isValid, isInvalid, errorMsg, placeholder, readOnly, ...others } = props;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup className="mb-2">
        <Form.Control
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          isValid={isValid}
          isInvalid={isInvalid}
          placeholder={placeholder || label}
          readOnly={readOnly}
          {...others}
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
  onBlur:      PropTypes.func,
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
  onBlur:      () => {},
  isValid:     false,
  isInvalid:   false,
  errorMsg:    '',
  placeholder: null,
  readOnly:    false,
};
