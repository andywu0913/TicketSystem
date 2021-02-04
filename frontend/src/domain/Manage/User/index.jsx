import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Axios from 'axios';
import swal from 'sweetalert2';

import UpdateUserModal from 'SRC/commons/Modal/UpdateUserModal';
import { getAccessToken } from 'SRC/utils/jwt';

import UserList from './UserList';

import BackendURL from 'BackendURL';

export default function User() {
  const [data, setData] = useState([]);
  const [needReload, setNeedReload] = useState(true);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [userObj, setUserObj] = useState({});

  useEffect(() => {
    if (!needReload) {
      return;
    }
    swal.showLoading();
    const accessToken = getAccessToken();
    Axios.get(`${BackendURL}/user/all`, { headers: { Authorization: `Bearer ${accessToken}` } })
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

  function updateUser(userObj) {
    setUserObj(userObj);
    setShowUpdateUserModal(true);
  }

  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="text-dark">Users</h1>
          <hr />
        </Col>
      </Row>
      <UserList
        users={data}
        updateUser={updateUser}
      />
      <UpdateUserModal
        show={showUpdateUserModal}
        userId={userObj.id}
        name={userObj.name}
        email={userObj.email}
        role={String(userObj.role)}
        hideModal={() => setShowUpdateUserModal(false)}
        reloadData={() => setNeedReload(true)}
      />
    </Container>
  );
}
