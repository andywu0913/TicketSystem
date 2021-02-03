import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Axios from 'axios';

import { getAccessToken } from 'SRC/utils/jwt';

import UsersList from './UsersList';
import UpdateUserModal from 'SRC/commons/Modal/UpdateUserModal';

export default class extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.showUpdateUserModal = this.showUpdateUserModal.bind(this);
    this.hideUpdateUserModal = this.hideUpdateUserModal.bind(this);
    this.state = { data: [], showUpdateUserModal: false, userObj: null };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const self = this;
    const accessToken = getAccessToken();
    Axios.get('http://localhost:3000/api/user/all', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      self.setState({ data: response.data.data });
    }).catch((error) => {
      // TODO
    });
  }

  showUpdateUserModal(userObj) {
    this.setState({ showUpdateUserModal: true, userObj });
  }

  hideUpdateUserModal() {
    this.setState({ showUpdateUserModal: false, userObj: null });
  }

  render() {
    const { data, showUpdateUserModal, userObj } = this.state;
    return (
      <Container className="p-3">
        <Row>
          <Col>
            <h1 className="text-dark">Users</h1>
            <hr />
          </Col>
        </Row>
        <UsersList data={data} showUpdateUserModal={this.showUpdateUserModal} />
        <UpdateUserModal show={showUpdateUserModal} userObj={userObj} hideModal={this.hideUpdateUserModal} reloadData={this.loadData} />
      </Container>
    );
  }
}
