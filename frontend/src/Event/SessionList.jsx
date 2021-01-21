import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BagCheckFill, BagXFill } from 'react-bootstrap-icons';
import Axios from 'axios';

class SessionList extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    const self = this;
    const { eventId } = this.props;
    Axios.get(`http://localhost:3000/api/session/?event_id=${eventId}`, {
    }).then((response) => {
      const { data } = response.data;
      data.forEach(session => {
        session.time = new Date(session.time).toLocaleString();
        session.ticket_sell_time_open = new Date(session.ticket_sell_time_open).toLocaleString();
        session.ticket_sell_time_end = new Date(session.ticket_sell_time_end).toLocaleString();
      });
      self.setState({ data });
    }).catch((error) => {

    });
  }

  render() {
    const { bookTicket } = this.props;
    const { data } = this.state;
    const sessions = data.map((session) => (
      <tr key={session.id}>
        <td className="align-middle"><p>{session.address}</p><p>{new Date(session.time).toLocaleString()}</p></td>
        <td className="align-middle"><span>{session.ticket_sell_time_open}</span> - <span>{session.ticket_sell_time_end}</span></td>
        <td className="align-middle">{session.open_seats ? session.open_seats : '--'} / {session.max_seats}</td>
        <td className="align-middle">{session.price}</td>
        <td className="align-middle">
          {session.is_active
            ? (
              <OverlayTrigger overlay={<Tooltip>Book Ticket!</Tooltip>}>
                <Link to="#" onClick={() => bookTicket(session)} className="text-reset">
                  <BagCheckFill className="text-muted" size="1.25rem" />
                </Link>
              </OverlayTrigger>
            )
            : (
              <OverlayTrigger overlay={<Tooltip>Currently Inactive:(</Tooltip>}>
                <BagXFill className="text-muted" size="1.25rem" />
              </OverlayTrigger>
            )}
        </td>
      </tr>
    ));
    return (
      <Table striped bordered hover responsive className="text-center">
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
    );
  }
}

SessionList.propTypes = {
  eventId: PropTypes.number,
};

SessionList.defaultProps = {
  eventId: 0,
};

export default SessionList;
