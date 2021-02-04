import React, { useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import EventCardInfo from './EventCardInfo';
import EventCardSession from './EventCardSession';

function EventCard(props) {
  const [tab, seTab] = useState('info');
  const { id, name, description, startDate, endDate, deleteEvent } = props;

  return (
    <Row className="mb-5">
      <Col>
        <Tabs activeKey={tab} onSelect={seTab} className="border-bottom-0">
          <Tab eventKey="info" title="Info">
            <EventCardInfo id={id} name={name} description={description} startDate={startDate} endDate={endDate} />
          </Tab>
          <Tab eventKey="session" title="Session" tabClassName="mr-auto">
            <EventCardSession show={tab === 'session'} id={id} />
          </Tab>
          <Tab eventKey="modify" title={<PencilSquare className="text-muted" size="1.25rem" />}>
            {tab === 'modify' && <Redirect push to={`/manage/event/${id}/edit`} />}
          </Tab>
          <Tab title={<TrashFill className="text-muted" size="1.25rem" onClick={() => deleteEvent(id)} />} />
        </Tabs>
      </Col>
    </Row>
  );
}

EventCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  deleteEvent: PropTypes.func,
};

EventCard.defaultProps = {
  id: null,
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  deleteEvent: () => {},
};

export default EventCard;
