import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import {BoxArrowInRight, Github, LockFill, PersonFill} from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';
import JWTDecode from "jwt-decode";

import InputTextGroup from './InputTextGroup';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signInGithub = this.signInGithub.bind(this);
    this.state = {uname: '', password: ''};
  }

  handleChange(event) {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val});
  }

  handleSubmit(event) {
    event.preventDefault();
    
    let uname = this.state.uname;
    let password = this.state.password;

    if(!uname.length || !password.length)
      return;

    Axios.post('http://localhost:3000/api/user/login', {uname, password})
    .then(function(response) {
      let data = response.data.data;
      localStorage.setItem('access_token', data['access_token']);
      localStorage.setItem('refresh_token', data['refresh_token']);
      localStorage.setItem('expires_in', data['expires_in']);
      
      let jwt = JWTDecode(data['access_token']);
      localStorage.setItem('user_id', jwt['user_id']);
      localStorage.setItem('role', jwt['role']);
      localStorage.setItem('name', jwt['name']);

      Swal.fire({icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000})
          .then(() => window.location.reload());

      // TODO:jwt countdown
      // redirect page
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

  signInGithub() {
    console.log('hi github');
  }

  render() {
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs={true} sm={8} md={6} lg={5} xl={4}>
            <Card>
              <Card.Body>
                <Card.Text className="text-center text-secondary">Sign in to start your session</Card.Text>
                <Form onSubmit={this.handleSubmit}>
                  <InputTextGroup label="Username" name="uname" type="text" value={this.state.uname} icon={<PersonFill />} onChange={this.handleChange} />
                  <InputTextGroup label="Password" name="password" type="password" value={this.state.password} icon={<LockFill />} onChange={this.handleChange} />
                  <br />
                  <Button variant="primary" type="submit" block><BoxArrowInRight />{' '}Sign In</Button>

                  <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                  <Button variant="secondary" block><Github />{' '}Sign In with GitHub</Button>
                </Form>
                <hr />
                <Card.Text className="text-center text-secondary">Don't have an account? <Link to="/user/signup">Sign up</Link> now!</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignIn;
