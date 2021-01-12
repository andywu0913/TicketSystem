import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Nav, Navbar, NavDropdown, Image} from 'react-bootstrap';
import {Collection, PeopleFill, PersonCircle, Wallet2} from 'react-bootstrap-icons';

import logo from './images/logo.svg';


class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let name = localStorage.getItem('name');
    let role = parseInt(localStorage.getItem('role') || -1);

    return (
      <header>
        <Navbar bg="light" expand="sm">
          <Link to="/">
            <Navbar.Brand>
              <Image src={logo} height="30"/>
              <Navbar.Text>Ticket System</Navbar.Text>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {name && role
              ? <NavBarUserFunctions name={name} role={role}/>
              : <NavBarSignInSignUpButtons />
            }
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}

class NavBarSignInSignUpButtons extends Component {
  render() {
    return (
      <Nav>
        <Nav.Item>
          <Link to="/user/signin" className="nav-link">
            <Button variant="outline-secondary">Sign In</Button>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/user/signup" className="nav-link">
            <Button variant="primary">Sign Up</Button>
          </Link>
        </Nav.Item>
      </Nav>
    );
  }
}

class NavBarUserFunctions extends Component {
  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }

  signout() {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    return (
      <Nav>
        { this.props.role < 2 ? <ManageUsers /> : null }
        { this.props.role < 3 ? <ManageEvents /> : null }
        <ManageTickets />
        <NavDropdown title={<span><PersonCircle className="mr-1" />{this.props.name}</span>} alignRight>
          <Nav.Item className="pl-3 pr-3">
            <Nav.Link as={Link} href="#" to="/user">Profile</Nav.Link>
          </Nav.Item>
          <NavDropdown.Divider />
          <Nav.Item className="pl-3 pr-3">
            <Nav.Link as={Link} href="#" to="#" onClick={this.signout}>Sign Out</Nav.Link>
          </Nav.Item>
        </NavDropdown>
      </Nav>
    );
  }
}

function ManageUsers() {
  return (
    <Nav.Item>
      <Link to="/manage/user" className="nav-link">
        <span><PeopleFill className="mr-1" />Users</span>
      </Link>
    </Nav.Item>
  );
}

function ManageEvents() {
  return (
  <Nav.Item>
    <Link to="/manage/event" className="nav-link">
      <span><Collection className="mr-1" />Events</span>
    </Link>
  </Nav.Item>
  );
}
function ManageTickets() {
  return (
    <Nav.Item>
      <Link to="/manage/ticket" className="nav-link">
        <span><Wallet2 className="mr-1" />Tickets</span>
      </Link>
    </Nav.Item>
  );
}

export default Header;
