import React, {Component} from 'react';
import {Form, InputGroup} from 'react-bootstrap';

class InputTextGroup extends Component {
  render () {
    this.label = this.props.label || '';
    this.name  = this.props.name  || '';
    this.type  = this.props.type  || '';
    this.value = this.props.value || '';
    this.icon  = this.props.icon  || '';
    this.handleChange = this.props.onChange || function() {console.error('Have to override the onChange function.')};

    return (
      <Form.Group>
        <Form.Label>{this.label}</Form.Label>
        <InputGroup className="mb-2">
          <Form.Control name={this.name} type={this.type} value={this.value} onChange={this.handleChange} placeholder={this.label} />
          <InputGroup.Append>
            <InputGroup.Text>{this.icon}</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    );
  }
}

export default InputTextGroup;
