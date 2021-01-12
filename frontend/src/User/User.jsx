import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Col, Container, Form, InputGroup, Row, Tab, Tabs} from 'react-bootstrap';
import {EnvelopeFill, KeyFill, PersonBadge, PersonCheckFill, PersonFill, LockFill} from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';
import JWTDecode from "jwt-decode";

import InputTextGroup from './InputTextGroup';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {tab: 'profile'};
  }

  render() {
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-center">
          <Col xs={true} sm={8} md={6} lg={5} xl={4}>
            <Tabs activeKey={this.state.tab} onSelect={tab => this.setState({tab})} className="border-bottom-0">
              <Tab eventKey="profile" title="Profile">
                <UpdateProfileTab />
              </Tab>
              <Tab eventKey="password" title="Password">
                <UpdatePasswordTab />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    );
  }
}

class UpdateProfileTab extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {changed: false, uname: '', name: '', email: ''};
  }

  componentDidMount() {
    let self = this;
    Axios.get('http://localhost:3000/api/user', {headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }})
    .then(function(response) {
      let data = response.data.data;
      self.setState({...data});
    })
    .catch(function(error) {
      
    });
  }

  handleChange(event) {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val, changed: true});
  }

  handleSubmit(event) {
    event.preventDefault();
    let self = this;
    Axios.put('http://localhost:3000/api/user', {...self.state}, {headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }})
    .then(function(response) {
      localStorage.setItem('name', self.state.name);
      Swal.fire({icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000})
          .then(() => window.location.reload());
    })
    .catch(function(error) {
      if(error.response && error.response.data) {
        let message = error.response.data.error_msg || '';
        Swal.fire({icon: 'error', title: 'Error', text: message});
        return;
      }
      Swal.fire({icon: 'error', title: 'Error', text: 'Unknown error.'});
    });
  }

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Text className="text-center text-secondary">Update Profile</Card.Text>
          <Form onSubmit={this.handleSubmit}>
            <InputTextGroup label="Username" name="uname" type="text" value={this.state.uname} icon={<PersonFill />} onChange={this.handleChange} />
            <InputTextGroup label="Nickname" name="name" type="text" value={this.state.name} icon={<PersonBadge />} onChange={this.handleChange} />
            <InputTextGroup label="Email" name="email" type="email" value={this.state.email} icon={<EnvelopeFill />} onChange={this.handleChange} />
            <InputTextGroup label="Role" name="role" type="text" value={this.state.rname} icon={<KeyFill />} readOnly={true} />
            <br />
            <Button variant="primary" type="submit" disabled={!this.state.changed} block><PersonCheckFill />{' '}Update</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

class UpdatePasswordTab extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {password: '', passwordNew: '', passwordNewConfirm: ''};
  }

  handleChange(event) {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val});
  }

  handleSubmit(event) {
    event.preventDefault();
    let {password, passwordNew, passwordNewConfirm} = this.state;
    if(passwordNew !== passwordNewConfirm) {
      Swal.fire({icon: 'error', title: 'Error', text: 'Your confirm new password does not match your new password.'});
      return;
    }

    let self = this;
    Axios.put('http://localhost:3000/api/user/password', {password_current: password, password_new: passwordNew}, {headers: {
      Authorization: 'Bearer ' + localStorage.getItem('access_token')
    }})
    .then(function(response) {
      Swal.fire({icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000})
          .then(() => window.location.reload());
    })
    .catch(function(error) {
      if(error.response && error.response.data) {
        let message = error.response.data.error_msg || '';
        Swal.fire({icon: 'error', title: 'Error', text: message});
        return;
      }
      Swal.fire({icon: 'error', title: 'Error', text: 'Unknown error.'});
    });
  }

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Text className="text-center text-secondary">Update Password</Card.Text>
          <Form onSubmit={this.handleSubmit}>
            <InputTextGroup label="Current Password" name="password" type="password" value={this.state.password} icon={<LockFill />} onChange={this.handleChange} />
            <hr />
            <InputTextGroup label="New Password" name="passwordNew" type="password" value={this.state.passwordNew} icon={<LockFill />} onChange={this.handleChange} />
            <InputTextGroup label="Confirm New Password" name="passwordNewConfirm" type="password" value={this.state.passwordNewConfirm} icon={<LockFill />} onChange={this.handleChange} />
            <br />
            <Button variant="primary" type="submit" block><PersonCheckFill />{' '}Update</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

export default User;
