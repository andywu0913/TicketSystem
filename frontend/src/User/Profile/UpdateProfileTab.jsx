import React, { Component } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { EnvelopeFill, KeyFill, PersonBadge, PersonCheckFill, PersonFill } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken, renew } from 'SRC/utils/jwt';

import InputTextGroup from 'SRC/commons/InputTextGroup';

export default class extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { changed: false, uname: '', name: '', email: '' };
  }

  componentDidMount() {
    const self = this;
    const accessToken = getAccessToken();
    Axios.get('http://localhost:3000/api/user', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        const { data } = response.data;
        const isAdmin = (data.role === 1);
        self.setState({ isAdmin, ...data });
      })
      .catch((error) => {

      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, changed: true });
  }

  handleSubmit(event) {
    event.preventDefault();
    const self = this;
    const accessToken = getAccessToken();
    Axios.put('http://localhost:3000/api/user', { ...self.state }, { headers: {
      Authorization: `Bearer ${accessToken}`,
    } })
      .then(() => {
        renew(() => {
          Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
            .then(() => window.location.reload());
        });
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
    const { uname, name, email, rname, changed } = this.state;
    return (
      <Card>
        <Card.Body>
          <Card.Text className="text-center text-secondary">Update Profile</Card.Text>
          <Form onSubmit={this.handleSubmit}>
            <InputTextGroup label="Username" name="uname" type="text" value={uname} icon={<PersonFill />} onChange={this.handleChange} />
            <InputTextGroup label="Nickname" name="name" type="text" value={name} icon={<PersonBadge />} onChange={this.handleChange} />
            <InputTextGroup label="Email" name="email" type="email" value={email} icon={<EnvelopeFill />} onChange={this.handleChange} />
            <InputTextGroup label="Role" name="role" type="text" value={rname} icon={<KeyFill />} onChange={this.handleChange} readOnly />
            <br />
            <Button variant="primary" type="submit" disabled={!changed} block><PersonCheckFill />{' '}Update</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}
