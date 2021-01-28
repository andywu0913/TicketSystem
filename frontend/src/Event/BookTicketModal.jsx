import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { EaselFill, Check2 } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { verifySaved } from 'SRC/utils/jwt';
import InputTextGroup from 'SRC/commons/InputTextGroup';

import { getAccessToken } from 'SRC/utils/jwt';

class BookTicketModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { changed: null, booked: false };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.show) {
      return { changed: null };
    }
    if (props.show && state.changed === null) {
      const isVerified = verifySaved();
      return { ...props.sessionObj, changed: false, isVerified };
    }
    return null;
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, changed: true });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { id, seat } = this.state;
    const accessToken = getAccessToken();
    Axios.post(`http://localhost:3000/api/ticket/?session_id=${id}`, { seat_no: seat }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(() => {
      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
      this.setState({ booked: true });
    }).catch((error) => {
      if (error.response && error.response.data) {
        const message = error.response.data.error_msg || '';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
  }

  render() {
    const { show, hideModal } = this.props;
    if (!show) {
      return null;
    }
    const { address, time, open_seats: openSeats, price, seat, changed, isVerified, booked } = this.state;
    return (
      <Modal show={show} onHide={hideModal} size="md" centered>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {address}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Time: {time}</p>
            <p>Price: {price}</p>
            <p>Available seats left: {openSeats}</p>
            <InputTextGroup label="Seat No" name="seat" type="number" value={seat} icon={<EaselFill />} onChange={this.handleChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={!changed} block><Check2 />{' '}Book</Button>
          </Modal.Footer>
        </Form>
        {isVerified || <Redirect to="/user/signin" />}
        {booked && <Redirect to="/manage/ticket" />}
      </Modal>
    );
  }
}

BookTicketModal.propTypes = {
  show: PropTypes.bool,
  sessionObj: PropTypes.instanceOf(Object),
  hideModal: PropTypes.func,
};

BookTicketModal.defaultProps = {
  show: false,
  sessionObj: {},
  hideModal: () => {},
};

export default BookTicketModal;
