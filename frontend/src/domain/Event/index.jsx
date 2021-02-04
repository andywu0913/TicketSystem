import React, { useEffect, useState } from 'react';
import { Col, Container, Image, Row, Tab, Tabs } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import { useHistory, useParams } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import BookTicketModal from 'SRC/commons/Modal/BookTicketModal';
import { verifySaved } from 'SRC/utils/jwt';

import SessionList from './SessionList';

import BackendURL from 'BackendURL';

function Event() {
  const params = useParams();
  const history = useHistory();
  const [showBootTicketModal, setShowBootTicketModal] = useState(false);
  const [event, setEvent] = useState({});
  const [sessions, setSessions] = useState([]);
  const [sessionObj, setSessionObj] = useState({});

  useEffect(() => {
    axios.get(`${BackendURL}/event/${params.id}`)
      .then((response) => {
        const { data } = response.data;
        setEvent(data);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { error_msg: message = '' } = error.response.data;
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }, []);

  useEffect(() => {
    axios.get(`${BackendURL}/session/?event_id=${params.id}`)
      .then((response) => {
        const { data } = response.data;
        setSessions(data);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { error_msg: message = '' } = error.response.data;
          swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }, []);

  function bookTicket(sessionObj) {
    setSessionObj(sessionObj);
    setShowBootTicketModal(true);
  }

  function redirectSignIn() {
    history.push('/user/signin');
  }

  return (
    <Container className="p-3">
      <Row>
        <Col>
          {event.name
            ? <h1 className="text-dark">{event.name}</h1>
            : (
              <ContentLoader width="100%" height="40">
                <rect x="0" y="0" rx="10" ry="10" width="80%" height="100%" />
              </ContentLoader>
            )}
          <hr />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4} lg={3} className="mb-4">
          <Image src="https://via.placeholder.com/300x200" className="mb-2" rounded fluid />
          <Image src="https://via.placeholder.com/300x200" className="mb-2" rounded fluid />
          <Image src="https://via.placeholder.com/300x200" className="mb-2" rounded fluid />
        </Col>
        <Col xs={12} md={8} lg={9} className="mb-4">
          <Row>
            <Col>
              <Tabs className="border-bottom-0">
                <Tab eventKey="session" title="Sessions" disabled>
                  {sessions.length > 0
                    ? <SessionList sessions={sessions} bookTicket={verifySaved() ? bookTicket : redirectSignIn} />
                    : (
                      <ContentLoader width="100%" height="250">
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
              {event.description
                ? <div dangerouslySetInnerHTML={{ __html: event.description }} />
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
      <BookTicketModal
        show={showBootTicketModal}
        sessionId={sessionObj.id}
        address={sessionObj.address}
        time={sessionObj.time}
        price={sessionObj.price}
        openSeats={sessionObj.open_seats}
        hideModal={() => setShowBootTicketModal(false)}
        redirect={() => history.push('/manage/ticket')}
      />
    </Container>
  );
}

export default Event;
