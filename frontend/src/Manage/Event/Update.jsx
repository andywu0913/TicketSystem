import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ArrowLeftShort, CalendarPlus } from 'react-bootstrap-icons';
import Axios from 'axios';

import { getAccessToken, getUserId } from 'SRC/utils/jwt';

export default class extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
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
  }

  componentDidMount() {
    const self = this;
    const { id } = self.props.match.params;
    Axios.get(`http://localhost:3000/api/event/${id}`, {
    }).then((response) => {
      const { name, description, start_date: startDate, end_date: endDate } = response.data.data;
      self.setState({ name, description, startDate, endDate });
    }).catch((error) => {

    });
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    console.log(this.state);
    const { name, description, startDate, endDate } = this.state;
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-md-center">
          <Col xs sm={12} md={9} lg={8} xl={6}>
            <Card>
              <Card.Body>
                <Form onSubmit={this.handleSubmit}>
                  <h2 className="text-dark mb-3">Update Event</h2>
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
                  <Button variant="primary" type="submit" block><CalendarPlus />{' '}Update</Button>
                  <Card.Text className="text-center text-secondary mt-1 mb-1">- or -</Card.Text>
                  <Button variant="secondary" block onClick={this.goBack}><ArrowLeftShort />{' '}Go Back</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
