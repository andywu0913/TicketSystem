import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

function InputTextGroup(props) {
  const { label, name, options, value, icon, readOnly, onChange } = props;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control as="select" name={name} value={value} onChange={onChange} readOnly={readOnly}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.text}</option>)}
        </Form.Control>
        <InputGroup.Append>
          <InputGroup.Text>{icon}</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
  );
}

InputTextGroup.propTypes = {
  label:    PropTypes.string,
  name:     PropTypes.string,
  options:  PropTypes.instanceOf(Array),
  value:    PropTypes.number,
  icon:     PropTypes.instanceOf(Object),
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

InputTextGroup.defaultProps = {
  label:    '',
  name:     '',
  options:  [],
  value:    '',
  icon:     null,
  readOnly: false,
  onChange: () => {},
};

export default InputTextGroup;
