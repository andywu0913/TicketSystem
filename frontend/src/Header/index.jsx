import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Image } from 'react-bootstrap';

import { verifySaved, clearSaved, getUserName, getUserRole } from 'SRC/utils/jwt';

import logo from 'SRC/images/logo.svg';

import NavBarSignInSignUpButtons from './NavBarSignInSignUpButtons';
import NavBarUserFunctions from './NavBarUserFunctions';

export default class extends Component {
  signout() {
    clearSaved();
    window.location.reload();
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
