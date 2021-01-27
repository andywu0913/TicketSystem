import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';

export default function NavBarSignInSignUpButtons() {
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
