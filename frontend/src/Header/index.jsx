import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Navbar } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert2';

import BackendURL from 'BackendURL';

import { getAccessToken, getUserName, getUserRole, verifySaved, clearSaved } from 'SRC/utils/jwt';

import logo from 'SRC/images/logo.svg';

import NavBarSignInSignUpButtons from './NavBarSignInSignUpButtons';
import NavBarUserFunctions from './NavBarUserFunctions';

export default function Header() {
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
            ? <NavBarUserFunctions name={name} role={role} signout={signout} />
            : <NavBarSignInSignUpButtons />}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

function signout() {
  swal.showLoading();
  const accessToken = getAccessToken();
  axios.get(`${BackendURL}/user/logout`, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(() => {})
    .catch((error) => {
      if (error.response && error.response.data) {
        const { error_msg: message = '' } = error.response.data;
        swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    })
    .then(() => {
      clearSaved();
      window.location.reload();
    });
}
