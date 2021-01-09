import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Nav, Navbar, NavDropdown, Image} from 'react-bootstrap';
import {Collection, PersonCircle, Wallet2} from 'react-bootstrap-icons';

import logo from './images/logo.svg';


class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
            {!this.props.name || !this.props.role
              ? <ShowSignInSignUpButtons />
              : <ShowUserFunctions name={this.props.name} role={this.props.role} signout={this.props.signout} />
            }
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}

function ShowSignInSignUpButtons() {
  return (
    <Nav>
      <Nav.Item>
        <Link to="/signin" className="nav-link">
          <Button variant="outline-secondary">Sign In</Button>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/signup" className="nav-link">
          <Button variant="primary">Sign Up</Button>
        </Link>
      </Nav.Item>
    </Nav>
  );
}

function ShowUserFunctions(props) {
  return (
    <Nav>
      <Nav.Item>
        <Link to="/event" className="nav-link">
          <span><Collection className="mr-1" />Event</span>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/ticket" className="nav-link">
          <span><Wallet2 className="mr-1" />Ticket</span>
        </Link>
      </Nav.Item>
      <NavDropdown title={<span><PersonCircle className="mr-1" />{props.name}</span>} alignRight>
        <Nav.Item>
          <Link to="/profile" className="nav-link">Profile</Link>
        </Nav.Item>
        <NavDropdown.Divider />
        <Nav.Item>
          <Link to="#" onClick={props.signout} className="nav-link">Sign Out</Link>
        </Nav.Item>
      </NavDropdown>
    </Nav>
  );
}

export default Header;
