import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Collection, PeopleFill, PersonCircle, Wallet2 } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function NavBarUserFunctions(props) {
  const { name, role, signout } = props;
  return (
    <Nav>
      { [1].includes(role) && <ManageUsers /> }
      { [1, 2].includes(role) && <ManageEvents /> }
      { [1, 2, 3].includes(role) && <ManageTickets /> }
      <NavDropdown title={<span><PersonCircle className="mr-1" />{name}</span>} alignRight>
        <Nav.Item className="pl-3 pr-3">
          <Nav.Link as={Link} href="#" to="/user">Profile</Nav.Link>
        </Nav.Item>
        <NavDropdown.Divider />
        <Nav.Item className="pl-3 pr-3">
          <Nav.Link as={Link} href="#" to="#" onClick={signout}>Sign Out</Nav.Link>
        </Nav.Item>
      </NavDropdown>
    </Nav>
  );
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

NavBarUserFunctions.propTypes = {
  name: PropTypes.string,
  role: PropTypes.number,
  signout: PropTypes.func,
};

NavBarUserFunctions.defaultProps = {
  name: null,
  role: null,
  signout: () => {},
};
