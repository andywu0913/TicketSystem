import React, { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Axios from 'axios';

import { getAccessToken } from 'SRC/utils/jwt';

import UsersList from './UsersList';
import UserUpdateModal from 'SRC/commons/Modal/UserUpdateModal';

export default class extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.showUserUpdateModal = this.showUserUpdateModal.bind(this);
    this.hideUserUpdateModal = this.hideUserUpdateModal.bind(this);
    this.state = { data: [], showUserUpdateModal: false, userObj: null };
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

  showUserUpdateModal(userObj) {
    this.setState({ showUserUpdateModal: true, userObj });
  }

  hideUserUpdateModal() {
    this.setState({ showUserUpdateModal: false, userObj: null });
  }

  render() {
    const { data, showUserUpdateModal, userObj } = this.state;
    return (
      <Container className="p-3">
        <Row>
          <Col>
            <h1 className="text-dark">Users</h1>
            <hr />
          </Col>
        </Row>
        <UsersList data={data} showUserUpdateModal={this.showUserUpdateModal} />
        <UserUpdateModal show={showUserUpdateModal} userObj={userObj} hideModal={this.hideUserUpdateModal} reloadData={this.loadData} />
      </Container>
    );
  }
}
