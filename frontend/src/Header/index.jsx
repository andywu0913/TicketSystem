import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Image } from 'react-bootstrap';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken, verifySaved, clearSaved, getUserName, getUserRole } from 'SRC/utils/jwt';

import logo from 'SRC/images/logo.svg';

import NavBarSignInSignUpButtons from './NavBarSignInSignUpButtons';
import NavBarUserFunctions from './NavBarUserFunctions';

export default class extends Component {
  signout() {
    Swal.showLoading();
    const accessToken = getAccessToken();
    Axios.get('http://localhost:3000/api/user/logout', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        clearSaved();
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { error_msg: message = '' } = error.response.data;
          Swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
  }

  render() {
    const isVerified = verifySaved();
    const name = getUserName();
    const role = getUserRole();
    return (
      <header>
        <Navbar bg="light" expand="sm">
          <Link to="/">
            <Navbar.Brand>
              <Image src={logo} height="30" />
              <Navbar.Text>Ticket System</Navbar.Text>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {isVerified
              ? <NavBarUserFunctions name={name} role={role} signout={this.signout} />
              : <NavBarSignInSignUpButtons />}
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}
