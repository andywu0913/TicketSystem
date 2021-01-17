import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { EnvelopeFill, KeyFill, PersonBadge, PersonCheckFill } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import InputTextGroup from './InputTextGroup';

import { getAccessToken } from 'SRC/utils/jwt';

class UserUpdateModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { changed: null };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.show) {
      return { changed: null };
    }
    if (props.show && state.changed === null) {
      return { ...props.userObj, changed: false };
    }
    return null;
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, changed: true });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email, role, id } = this.state;

    const accessToken = getAccessToken();
    Axios.put(`http://localhost:3000/api/user/${id}`, { name, email, role }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(() => {
      const { loadData, hideModal } = this.props;
      loadData();
      hideModal();
      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
    }).catch((error) => {
      if (error.response && error.response.data) {
        const message = error.response.data.error_msg || '';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
  }

  render() {
    const { show, hideModal } = this.props;
    if (!show) {
      return null;
    }

    const { name, email, role, changed } = this.state;
    return (
      <Modal show={show} onHide={hideModal} size="md" centered>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              User Update
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputTextGroup label="Name" name="name" type="text" value={name} icon={<PersonBadge />} onChange={this.handleChange} />
            <InputTextGroup label="Email" name="email" type="email" value={email} icon={<EnvelopeFill />} onChange={this.handleChange} />
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <InputGroup>
                <Form.Control as="select" name="role" value={role} onChange={this.handleChange}>
                  <option value="1">Admin</option>
                  <option value="2">Host</option>
                  <option value="3">User</option>
                </Form.Control>
                <InputGroup.Append>
                  <InputGroup.Text><KeyFill /></InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={!changed} block><PersonCheckFill />{' '}Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

UserUpdateModal.propTypes = {
  show: PropTypes.bool,
  userObj: PropTypes.instanceOf(Object),
  hideModal: PropTypes.func,
  loadData: PropTypes.func,
};

UserUpdateModal.defaultProps = {
  show: false,
  userObj: {},
  hideModal: () => {},
  loadData: () => {},
};

export default UserUpdateModal;
