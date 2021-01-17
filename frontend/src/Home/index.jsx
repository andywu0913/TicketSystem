import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

import DefaultLoadingPlaceholder from './DefaultLoadingPlaceholder';
import EventCards from './EventCards';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    const self = this;
    Axios.get('http://localhost:3000/api/event', {
    }).then((response) => {
      self.setState({ data: response.data.data });
    }).catch((error) => {

    });
  }

  render() {
    const { data } = this.state;
    return (
      <Container className="p-3">
        <Row>
          <Col>
            <h1 className="text-dark">Latest</h1>
            <hr />
          </Col>
        </Row>
        <Row>
          {data.length > 0
            ? <EventCards data={data} />
            : <DefaultLoadingPlaceholder nums={9} />}
        </Row>
      </Container>
    );
  }
}
