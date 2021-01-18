import React, { Component } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { PersonCheckFill, LockFill } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import InputTextGroup from 'SRC/commons/InputTextGroup';

export default class UpdatePasswordTab extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { password: '', passwordNew: '', passwordNewConfirm: '' };
  }

  handleChange(event) {
    const { name } = event.target;
    const val = event.target.value;
    this.setState({ [name]: val });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { password, passwordNew, passwordNewConfirm } = this.state;
    if (passwordNew !== passwordNewConfirm) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Your confirm new password does not match your new password.' });
      return;
    }

    const self = this;
    const accessToken = getAccessToken();
    Axios.put('http://localhost:3000/api/user/password', { password_current: password, password_new: passwordNew }, { headers: {
      Authorization: `Bearer ${accessToken}`,
    } })
      .then((response) => {
        Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => window.location.reload());
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const message = error.response.data.error_msg || '';
          Swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  render() {
    const { password, passwordNew, passwordNewConfirm } = this.state;
    return (
      <Card>
        <Card.Body>
          <Card.Text className="text-center text-secondary">Update Password</Card.Text>
          <Form onSubmit={this.handleSubmit}>
            <InputTextGroup label="Current Password" name="password" type="password" value={password} icon={<LockFill />} onChange={this.handleChange} />
            <hr />
            <InputTextGroup label="New Password" name="passwordNew" type="password" value={passwordNew} icon={<LockFill />} onChange={this.handleChange} />
            <InputTextGroup label="Confirm New Password" name="passwordNewConfirm" type="password" value={passwordNewConfirm} icon={<LockFill />} onChange={this.handleChange} />
            <br />
            <Button variant="primary" type="submit" block><PersonCheckFill />{' '}Update</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}
