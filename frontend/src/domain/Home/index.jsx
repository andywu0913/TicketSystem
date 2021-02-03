import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import axios from 'axios';
import swal from 'sweetalert2';

import DefaultLoadingPlaceholder from './DefaultLoadingPlaceholder';
import EventCards from './EventCards';

import BackendURL from 'BackendURL';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${BackendURL}/event`)
      .then((response) => {
        const { data } = response.data;
        setData(data);
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

  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="text-dark">Latest</h1>
          <hr />
        </Col>
      </Row>
      <Row>
        {data.length > 0
          ? <EventCards data={data} />
          : <DefaultLoadingPlaceholder nums={9} />}
      </Row>
    </Container>
  );
}
