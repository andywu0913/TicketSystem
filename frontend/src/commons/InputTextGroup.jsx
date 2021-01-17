import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

function InputTextGroup(props) {
  const { label, name, type, value, icon, readOnly, onChange } = props;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup className="mb-2">
        <Form.Control name={name} type={type} value={value} onChange={onChange} placeholder={label} readOnly={readOnly} />
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
  type:     PropTypes.string,
  value:    PropTypes.string,
  icon:     PropTypes.instanceOf(Object),
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};

InputTextGroup.defaultProps = {
  label:    '',
  name:     '',
  type:     '',
  value:    '',
  icon:     null,
  readOnly: false,
  onChange: () => {},
};

export default InputTextGroup;
