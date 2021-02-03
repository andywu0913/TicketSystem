import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

import UsersList from './UsersList';

import BackendURL from 'BackendURL';

export default function Audiance() {
  const params = useParams();
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);

  useEffect(() => {
    if (!needReload) {
      return;
    }
    swal.showLoading();
    const accessToken = getAccessToken();
    axios.get(`${BackendURL}/ticket/session/${params.id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        const { data } = response.data;
        setData(data);
        setNeedReload(false);
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
  }, [needReload]);

  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="text-dark">Audiance</h1>
          <hr />
        </Col>
      </Row>
      <UsersList data={data} reloadData={() => setNeedReload(true)} />
    </Container>
  );
}
