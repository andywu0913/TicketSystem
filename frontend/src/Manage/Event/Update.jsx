import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CalendarPlus } from 'react-bootstrap-icons';
import Axios from 'axios';

import { getAccessToken, getUserId } from 'SRC/utils/jwt';

export default class extends Component {
  componentDidMount() {
    const self = this;
    const { id } = self.props.match.params;
    console.log(id);
  }

  render() {
    return (
      <Container className="p-3">
        <Row>
          <Col>
            Update
          </Col>
        </Row>
      </Container>
    );
  }
}
