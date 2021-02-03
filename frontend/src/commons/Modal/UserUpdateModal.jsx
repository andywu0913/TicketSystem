import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { EnvelopeFill, KeyFill, PersonBadge, PersonCheckFill } from 'react-bootstrap-icons';

import Axios from 'axios';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import InputSelectGroup from 'SRC/commons/Input/InputSelectGroup';
import InputTextGroup from 'SRC/commons/Input/InputTextGroup';
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
    let { name, value } = event.target;
    if (name === 'role') {
      value = parseInt(value, 10);
    }
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
      const { reloadData, hideModal } = this.props;
      reloadData();
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
            <InputSelectGroup label="Role" name="role" options={[{ value: 1, text: 'Admin' }, { value: 2, text: 'Host' }, { value: 3, text: 'User' }]} value={role} icon={<KeyFill />} onChange={this.handleChange} />
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
  reloadData: PropTypes.func,
};

UserUpdateModal.defaultProps = {
  show: false,
  userObj: {},
  hideModal: () => {},
  reloadData: () => {},
};

export default UserUpdateModal;
