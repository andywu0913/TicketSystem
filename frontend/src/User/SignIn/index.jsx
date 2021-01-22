import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { BoxArrowInRight, Github, LockFill, PersonFill } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { saveAccessToken, saveRefreshToken, saveExpiration } from 'SRC/utils/jwt';
import InputTextGroup from 'SRC/commons/InputTextGroup';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signInGithub = this.signInGithub.bind(this);
    this.state = { uname: '', password: '' };
  }

  handleChange(event) {
    const { name } = event.target;
    const val = event.target.value;
    this.setState({ [name]: val });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { uname } = this.state;
    const { password } = this.state;

    if (!uname.length || !password.length) return;

    Axios.post('http://localhost:3000/api/user/login', { uname, password })
      .then((response) => {
        const { data } = response.data;
        saveAccessToken(data.access_token);
        saveRefreshToken(data.refresh_token);
        saveExpiration(data.expires_in);

        Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
          .then(() => window.location.reload());

      // redirect page
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

  signInGithub() {
    console.log('hi github');
  }

  render() {
    const { uname, password } = this.state;
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs sm={8} md={6} lg={5} xl={4}>
            <Card>
              <Card.Body>
                <Card.Text className="text-center text-secondary">Sign in to start your session</Card.Text>
                <Form onSubmit={this.handleSubmit}>
                  <InputTextGroup label="Username" name="uname" type="text" value={uname} icon={<PersonFill />} onChange={this.handleChange} />
                  <InputTextGroup label="Password" name="password" type="password" value={password} icon={<LockFill />} onChange={this.handleChange} />
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
