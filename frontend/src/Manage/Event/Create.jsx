import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col } from 'react-bootstrap';
import { PersonFill, LockFill, CalendarPlus, ArrowLeftShort } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken, getUserId } from 'SRC/utils/jwt';
import InputTextGroup from 'SRC/commons/InputTextGroup';

export default class extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { name: '', description: '', startDate: '', endDate: '' };
  }

  handleChange(event) {
    const { name } = event.target;
    const val = event.target.value;
    this.setState({ [name]: val });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { name, description, startDate, endDate } = this.state;

    if (!name.length || !description.length || !startDate.length || !endDate.length) return;

    const self = this;
    const accessToken = getAccessToken();
    Axios.post('http://localhost:3000/api/event/', { name, description, start_date: startDate, end_date: endDate }, { headers: {
      Authorization: `Bearer ${accessToken}`,
    } }).then((response) => {
      const { data } = response.data;

      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 })
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
    const { name, description, startDate, endDate } = this.state;
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs sm={12} md={9} lg={8} xl={6}>
            <Card>
              <Card.Body>
                <Form onSubmit={this.handleSubmit}>
                  <h2 className="text-dark mb-3">Create Event</h2>
                  <Form.Group>
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control type="text" name="name" value={name} onChange={this.handleChange} placeholder="Add title" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" value={description} onChange={this.handleChange} placeholder="Add some description here..." rows={5} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Event Period</Form.Label>
                    <Row>
                      <Col><Form.Control type="text" name="startDate" value={startDate} onChange={this.handleChange} placeholder="Start" /></Col>
                      <Col md={1}>~</Col>
                      <Col><Form.Control type="text" name="endDate" value={endDate} onChange={this.handleChange} placeholder="End" /></Col>
                    </Row>
                  </Form.Group>
                  <hr />
                  <Button variant="primary" type="submit" block><CalendarPlus />{' '}Create</Button>
                  <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                  <Button variant="secondary" block><ArrowLeftShort />{' '}Go Back</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
