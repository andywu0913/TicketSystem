import React, { Component } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import UpdatePasswordTab from './UpdatePasswordTab';
import UpdateProfileTab from './UpdateProfileTab';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { tab: 'profile' };
  }

  render() {
    const { tab } = this.state;
    return (
      <Container className="align-self-center mt-3 mb-3">
        <Row className="justify-content-center">
          <Col xs sm={8} md={6} lg={5} xl={4}>
            <Tabs activeKey={tab} onSelect={(tab) => this.setState({ tab })} className="border-bottom-0">
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
