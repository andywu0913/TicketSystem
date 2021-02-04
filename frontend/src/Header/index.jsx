import React from 'react';
import { Image, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import axios from 'axios';
import swal from 'sweetalert2';

import logo from 'SRC/images/logo.svg';
import { clearSaved, getAccessToken, getUserName, getUserRole, verifySaved } from 'SRC/utils/jwt';

import NavBarSignInSignUpButtons from './NavBarSignInSignUpButtons';
import NavBarUserFunctions from './NavBarUserFunctions';

import BackendURL from 'BackendURL';

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
