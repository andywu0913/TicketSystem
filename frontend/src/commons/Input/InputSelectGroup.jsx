import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import PropTypes from 'prop-types';

function InputTextGroup(props) {
  const { label, name, options, value, icon, onChange, onBlur, isValid, isInvalid, errorMsg, placeholder, ...others } = props;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          as="select"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          isValid={isValid}
          isInvalid={isInvalid}
          placeholder={placeholder || label}
          {...others}
        >
          {options.map((option) => <option key={option.value} value={option.value}>{option.text}</option>)}
        </Form.Control>
        {errorMsg && <Form.Control.Feedback type="invalid" tooltip>{errorMsg}</Form.Control.Feedback>}
        {icon && <InputGroup.Append><InputGroup.Text>{icon}</InputGroup.Text></InputGroup.Append>}
      </InputGroup>
    </Form.Group>
  );
}

InputTextGroup.propTypes = {
  label:       PropTypes.string,
  name:        PropTypes.string,
  options:     PropTypes.arrayOf(PropTypes.shape({
    value:     PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text:      PropTypes.string,
  })),
  value:       PropTypes.string,
  icon:        PropTypes.instanceOf(Object),
  onChange:    PropTypes.func,
  onChange:    PropTypes.func,
  onBlur:      PropTypes.func,
  isValid:     PropTypes.bool,
  isInvalid:   PropTypes.bool,
  errorMsg:    PropTypes.string,
  placeholder: PropTypes.string,
};

InputTextGroup.defaultProps = {
  label:       '',
  name:        '',
  options:     [],
  value:       '',
  icon:        null,
  onChange:    () => {},
  onBlur:      () => {},
  isValid:     false,
  isInvalid:   false,
  errorMsg:    '',
  placeholder: null,
};

export default InputTextGroup;
