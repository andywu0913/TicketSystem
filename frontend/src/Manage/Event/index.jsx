import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CalendarPlus } from 'react-bootstrap-icons';
import Axios from 'axios';

import { getAccessToken, getUserId } from 'SRC/utils/jwt';
import EventCard from './EventCard';

export default class extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.state = { data: [] };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const self = this;
    const accessToken = getAccessToken();
    const userId = getUserId();
    Axios.get(`http://localhost:3000/api/event/creator/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      self.setState({ data: response.data.data });
    }).catch((error) => {

    });
  }

  renderEventCardList(data) {
    const events = data.map((event) => {
      let { id, name, description, start_date: startDate, end_date: endDate } = event;
      description = description.replace(/(<([^>]+)>)/gi, '');
      startDate = new Date(startDate).toLocaleDateString();
      endDate = new Date(endDate).toLocaleDateString();

      return <EventCard key={id} id={id} name={name} description={description} startDate={startDate} endDate={endDate} reloadData={this.loadData} />;
    });
    return <>{events}</>;
  }

  renderEmpty() {
    return (
      <Row className="m-5 p-5 text-center text-muted">
        <Col>
          <h6>You haven't create any event yet.</h6>
        </Col>
      </Row>
    );
  }

  render() {
    const { data } = this.state;
    return (
      <Container className="p-3">
        <Row>
          <Col>
            <div className="d-flex justify-content-between">
              <h1 className="text-dark">My Events</h1>
              <h2 className="pt-2">
                <Link to="/manage/event/create" className="text-reset">
                  <OverlayTrigger overlay={<Tooltip>Create Event</Tooltip>}>
                    <CalendarPlus className="text-muted" />
                  </OverlayTrigger>
                </Link>
              </h2>
            </div>
            <hr />
          </Col>
        </Row>
        {data.length ? this.renderEventCardList(data) : this.renderEmpty()}
      </Container>
    );
  }
}
