import React, { Component } from 'react';
import { Container, Row, Col, Image, Tab, Tabs } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import Axios from 'axios';

import SessionList from './SessionList';
import BookTicketModal from './BookTicketModal';

export default class extends Component {
  constructor(props) {
    super(props);
    this.showBootTicketModal = this.showBootTicketModal.bind(this);
    this.hideBookTicketModal = this.hideBookTicketModal.bind(this);
    this.state = { showBootTicketModal: false, sessionObj: null };
  }

  componentDidMount() {
    const self = this;
    const { id } = self.props.match.params;
    Axios.get(`http://localhost:3000/api/event/${id}`, {
    }).then((response) => {
      const { data } = response.data;
      self.setState({ ...data });
    }).catch((error) => {

    });
  }

  showBootTicketModal(sessionObj) {
    this.setState({ showBootTicketModal: true, sessionObj });
  }

  hideBookTicketModal() {
    this.setState({ showBootTicketModal: false, sessionObj: null });
  }

  render() {
    const { id, name, description, showBootTicketModal, sessionObj } = this.state;
    return (
      <Container className="p-3">
        <Row>
          <Col>
            {name
              ? <h1 className="text-dark">{name}</h1>
              : (
                <ContentLoader width="100%" height="40">
                  <rect x="0" y="0" rx="10" ry="10" width="80%" height="100%" />
                </ContentLoader>
              )}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4} lg={4} className="mb-4">
            <Image src="https://static.tixcraft.com/images/activity/20_MAYDAY_8987933be02c14b4d8048f5fb91c1fab.jpg" rounded fluid />
          </Col>
          <Col xs={12} md={8} lg={8} className="mb-4">
            <Row>
              <Col>
                <Tabs className="border-bottom-0">
                  <Tab eventKey="session" title="Sessions" disabled>
                    {id
                      ? <SessionList eventId={id} bookTicket={this.showBootTicketModal} />
                      : (
                        <ContentLoader width="100%" height="150">
                          <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
                        </ContentLoader>
                      )}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Row>
              <Col>
                <h2 className="text-dark">Info</h2>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                {description
                  ? <div dangerouslySetInnerHTML={{ __html: description }} />
                  : (
                    <ContentLoader width="100%" height="150">
                      <rect x="0" y="0" rx="5" ry="50" width="95%" height="20" />
                      <rect x="0" y="35" rx="5" ry="50" width="70%" height="20" />
                      <rect x="0" y="70" rx="5" ry="50" width="90%" height="20" />
                      <rect x="0" y="105" rx="5" ry="50" width="60%" height="20" />
                    </ContentLoader>
                  )}
              </Col>
            </Row>
          </Col>
        </Row>
        <BookTicketModal show={showBootTicketModal} sessionObj={sessionObj} hideModal={this.hideBookTicketModal} />
      </Container>
    );
  }
}
