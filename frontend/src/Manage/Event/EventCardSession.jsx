import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Container, Row, Col, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ClockFill, BagCheckFill, BagXFill } from 'react-bootstrap-icons';
import Axios from 'axios';

class EventCardSession extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidUpdate(prevProps, prevState) {
    const { show } = this.props;
    if (show && !prevProps.show) {
      this.loadData();
    }
  }

  loadData() {
    const self = this;
    const { id } = this.props;
    Axios.get(`http://localhost:3000/api/session/?event_id=${id}`).then((response) => {
      self.setState({ data: response.data.data });
    }).catch((error) => {

    });
  }

  render() {
    const { id } = this.props;
    const { data } = this.state;
    const sessions = data.map((session) => (
      <tr key={session.id}>
        <td className="align-middle"><p>{session.address}</p><p>{new Date(session.time).toLocaleString()}</p></td>
        <td className="align-middle"><span>{session.ticket_sell_time_open}</span> - <span>{session.ticket_sell_time_end}</span></td>
        <td className="align-middle">{session.open_seats ? session.open_seats : '--'} / {session.max_seats}</td>
        <td className="align-middle">{session.price}</td>
        <td className="align-middle">
          <OverlayTrigger overlay={<Tooltip>Book Ticket!</Tooltip>}>
            <Link to="#" onClick={() => bookTicket(session)} className="text-reset">
              <BagCheckFill className="text-muted" size="1.25rem" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Currently Inactive:(</Tooltip>}>
            <BagXFill className="text-muted" size="1.25rem" />
          </OverlayTrigger>
        </td>
      </tr>
    ));
    return (
      <Card>
        <Container>
          <Row>
            <Col className="pl-0 pr-0">
              <Table striped bordered hover responsive className="mb-0 text-center">
                <thead>
                  <tr>
                    <th className="align-middle">Info</th>
                    <th className="align-middle">Sell Open Time</th>
                    <th className="align-middle">Available Seats</th>
                    <th className="align-middle">Price</th>
                    <th className="align-middle"></th>
                  </tr>
                </thead>
                <tbody>
                  {sessions}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </Card>
    );
  }
}

EventCardSession.propTypes = {
  id: PropTypes.number,
};

EventCardSession.defaultProps = {
  id: null,
};

export default EventCardSession;
