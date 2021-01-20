import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

import TicketCardList from './TicketCardList';
import TicketUpdateModal from './TicketUpdateModal';

import { getAccessToken } from 'SRC/utils/jwt';

export default class extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.showTicketUpdateModal = this.showTicketUpdateModal.bind(this);
    this.hideTicketUpdateModal = this.hideTicketUpdateModal.bind(this);
    this.state = { data: [], showTicketUpdateModal: false, selectedTicketId: null, selectedSeat: null };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const self = this;
    const accessToken = getAccessToken();
    Axios.get('http://localhost:3000/api/ticket', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      self.setState({ data: response.data.data });
    }).catch((error) => {

    });
  }

  showTicketUpdateModal(ticketId, seat) {
    this.setState({ showTicketUpdateModal: true, selectedTicketId: ticketId, selectedSeat: seat });
  }

  hideTicketUpdateModal() {
    this.setState({ showTicketUpdateModal: false });
  }

  render() {
    const { data, showTicketUpdateModal, selectedTicketId, selectedSeat } = this.state;
    return (
      <Container className="p-3">
        <Row>
          <Col>
            <h1 className="text-dark">My Tickets</h1>
            <hr />
          </Col>
        </Row>
        <TicketCardList data={data} showTicketUpdateModal={this.showTicketUpdateModal} />
        <TicketUpdateModal show={showTicketUpdateModal} ticketId={selectedTicketId} seat={selectedSeat} hideModal={this.hideTicketUpdateModal} reloadData={this.loadData} />
      </Container>
    );
  }
}
