import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Nav, Navbar, NavDropdown, Image} from 'react-bootstrap';
import {HouseFill} from 'react-bootstrap-icons';

class Error extends Component {
  render() {
    return (
      <div className="page-wrap d-flex flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 text-center">
              <span className="display-1 d-block">404</span>
              <div className="mb-4 lead">Oops! We can't seem to find the page you are looking for.</div>
              <Link to="/"><HouseFill /> Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Error;
