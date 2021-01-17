import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Button, Card, Col, Container, Form, InputGroup, Row} from 'react-bootstrap';
import {PersonPlusFill, Github, LockFill, PersonFill, PersonBadge, EnvelopeFill} from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import InputTextGroup from 'SRC/commons/InputTextGroup';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {uname: '', password: '', passwordConfirm: '', name: '', email: '', redirectToSignIn: false};
  }

  handleChange(event) {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({[name]: val});
  }

  handleSubmit(event) {
    event.preventDefault();
    
    let {uname, password, passwordConfirm, name, email} = this.state;
    

    if(!uname.length || !password.length || !passwordConfirm.length || !name.length || !email.length)
      return;

    if(password !== passwordConfirm)
      return;

    let self = this;
    Axios.post('http://localhost:3000/api/user/', {uname, password, name, email})
    .then(function(response) {
      let data = response.data.data;

      Swal.fire({icon: 'success', title: 'Success', text: 'You can now sign in with your new account.'})
          .then(() => self.setState({redirectToSignIn: true}));

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

  render() {
    if(this.state.redirectToSignIn)
      return <Redirect to='/user/signin' />;
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs={true} sm={8} md={6} lg={5} xl={4}>
            <Card>
              <Card.Body>
                <Card.Text className="text-center text-secondary">Sign in to start your session</Card.Text>
                <Form onSubmit={this.handleSubmit}>
                  <InputTextGroup label="Username" name="uname" type="text" value={this.state.uname} icon={<PersonFill />} onChange={this.handleChange} />
                  <InputTextGroup label="New Password" name="password" type="password" value={this.state.password} icon={<LockFill />} onChange={this.handleChange} />
                  <InputTextGroup label="Confirm New Password" name="passwordConfirm" type="password" value={this.state.passwordConfirm} icon={<LockFill />} onChange={this.handleChange} />
                  <InputTextGroup label="Nickname" name="name" type="text" value={this.state.name} icon={<PersonBadge />} onChange={this.handleChange} />
                  <InputTextGroup label="Email" name="email" type="email" value={this.state.email} icon={<EnvelopeFill />} onChange={this.handleChange} />
                  <br />
                  <Button variant="primary" type="submit" block><PersonPlusFill />{' '}Sign Up</Button>
                </Form>
                <hr />
                <Card.Text className="text-center text-secondary">Already have an account? <Link to="/user/signin">Sign in</Link> now!</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUp;
