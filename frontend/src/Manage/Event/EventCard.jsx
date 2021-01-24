import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Tab, Tabs } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';
import EventCardInfo from './EventCardInfo';
import EventCardSession from './EventCardSession';

class EventCard extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = { tab: 'info' };
  }

  handleDelete(event) {
    const accessToken = getAccessToken();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      Axios.delete(`http://localhost:3000/api/event/${event}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => {
        const { reloadData } = this.props;
        reloadData();
        Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
      }).catch((error) => {
        if (error.response && error.response.data) {
          const message = error.response.data.error_msg || '';
          Swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
    });
    return true;
  }

  render() {
    const { id, name, description, startDate, endDate } = this.props;
    const { tab } = this.state;
    return (
      <Row className="mb-4">
        <Col>
          <Tabs activeKey={tab} onSelect={(tab) => this.setState({ tab })} className="border-bottom-0">
            <Tab eventKey="info" title="Info">
              <EventCardInfo id={id} name={name} description={description} startDate={startDate} endDate={endDate} />
            </Tab>
            <Tab eventKey="session" title="Session" tabClassName="mr-auto">
              <EventCardSession show={tab === 'session'} id={id} />
            </Tab>
            <Tab eventKey="modify" title={<PencilSquare className="text-muted" size="1.25rem" />}>
              {tab === 'modify' && <Redirect push to={`/manage/event/${id}`} />}
            </Tab>
            <Tab title={<TrashFill className="text-muted" size="1.25rem" onClick={() => this.handleDelete(id)} />}>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    );
  }
}

EventCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

EventCard.defaultProps = {
  id: null,
  name: null,
  description: null,
  startDate: null,
  endDate: null,
};

export default EventCard;
