import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';

import axios from 'axios';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import UpdatePasswordTab from './UpdatePasswordTab';
import UpdateProfileTab from './UpdateProfileTab';

import BackendURL from 'BackendURL';

export default function Profile() {
  const [tab, setTab] = useState('profile');
  const [data, setData] = useState({ uname: '', name: '', email: '', rname: '' });

  useEffect(() => {
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.get(`${BackendURL}/user`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        const { data } = response.data;
        setData(data);
        swal.close();
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
    <Container className="align-self-center mt-3 mb-3">
      <Row className="justify-content-center">
        <Col xs sm={8} md={6} lg={5} xl={4}>
          <Tabs activeKey={tab} onSelect={setTab} className="border-bottom-0">
            <Tab eventKey="profile" title="Profile">
              <UpdateProfileTab user={data} />
            </Tab>
            <Tab eventKey="password" title="Password">
              <UpdatePasswordTab allowUpdate={!data.github_id} />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
