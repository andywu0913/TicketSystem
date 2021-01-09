import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import {BoxArrowInRight, Github, LockFill, PersonFill} from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';
import JWTDecode from "jwt-decode";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.signInDefault = this.signInDefault.bind(this);
    this.signInGithub = this.signInGithub.bind(this);
  }

  handleChange(event) {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val});
  }

  signInDefault(event) {
    let signin = this.props.signin;

    event.preventDefault();
    Axios.post('http://localhost:3000/api/user/login', {
      uname: this.state.uname,
      password: this.state.password
    })
    .then(function(response) {
      let data = response.data.data;
      let jwt = JWTDecode(data['access_token']);
      localStorage.setItem('access_token', data['access_token']);
      localStorage.setItem('refresh_token', data['refresh_token']);
      localStorage.setItem('expires_in', data['expires_in']);
      localStorage.setItem('user_id', jwt['user_id']);
      localStorage.setItem('role', jwt['role']);
      localStorage.setItem('name', jwt['name']);
      

      signin(jwt['name'], jwt['role']);
      Swal.fire({icon: 'success', title: 'Success', showConfirmButton: false, timer: 1500});

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
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={true} md={7} lg={6} xl={5}>
            <Card>
              <Card.Body>
                <Card.Text className="text-center text-secondary">Sign in to start your session</Card.Text>
                <Form onSubmit={this.signInDefault}>
                  
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control name="uname" type="text" onChange={this.handleChange} placeholder="Username" />
                      <InputGroup.Append>
                        <InputGroup.Text>
                          <PersonFill />
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-2">
                      <Form.Control name="password" type="password" onChange={this.handleChange} placeholder="Password" />
                      <InputGroup.Append>
                        <InputGroup.Text>
                        <LockFill />
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" onClick={this.signInDefault} block><BoxArrowInRight /> {' '}Sign In</Button>
                  <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                  <Button variant="secondary" block><Github /> {' '}Sign In with GitHub</Button>
                </Form>
                <hr />
                <Card.Text className="text-center text-secondary">Don't have an account? <Link to="/signup">Sign up</Link> now!</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignIn;
