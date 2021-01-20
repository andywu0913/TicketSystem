import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, FormControl, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios';
import Swal from 'sweetalert2';

import { getAccessToken } from 'SRC/utils/jwt';

class TicketUpdateModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = { ticketId: null, seat: null, changed: false };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.show) {
      return { changed: null };
    }
    if (props.show && state.changed === null) {
      const { ticketId, seat } = props;
      return { ticketId, seat, changed: false };
    }
    return null;
  }

  handleChange(event) {
    const seat = event.target.value;
    this.setState({ seat, changed: true });
  }

  handleUpdate(event) {
    const { ticketId, seat } = this.state;
    const accessToken = getAccessToken();
    Axios.put(`http://localhost:3000/api/ticket/${ticketId}`, {
      seat_no: parseInt(seat, 10),
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
      const { reloadData, hideModal } = this.props;
      reloadData();
      hideModal();
      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
    }).catch((error) => {
      if (error.response && error.response.data) {
        const message = error.response.data.error_msg || '';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
    });
  }

  handleDelete(event) {
    const accessToken = getAccessToken();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      const { ticketId } = this.state;
      Axios.delete(`http://localhost:3000/api/ticket/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          const { reloadData, hideModal } = this.props;
          reloadData();
          hideModal();
          Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            const message = error.response.data.error_msg || '';
            Swal.fire({ icon: 'error', title: 'Error', text: message });
            return;
          }
          Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
        });
    });
  }

  render() {
    const { show, hideModal } = this.props;
    if (!show) {
      return null;
    }

    const { seat, changed } = this.state;
    return (
      <Modal show={show} onHide={hideModal} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Seat Selection
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col><p>Change seat to</p></Col>
            </Row>
            <Row>
              <Col className="align-self-center text-center">
                <FormControl name="seat" size="lg" type="text" value={seat} onChange={this.handleChange} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.handleDelete}>Delete ticket</Button>
          <Button disabled={!changed} onClick={this.handleUpdate}>Update seat</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TicketUpdateModal.propTypes = {
  show: PropTypes.bool,
  ticketId: PropTypes.number,
  seat: PropTypes.number,
  hideModal: PropTypes.func,
  reloadData: PropTypes.func,
};

TicketUpdateModal.defaultProps = {
  show: false,
  ticketId: PropTypes.number,
  seat: PropTypes.number,
  hideModal: () => {},
  reloadData: () => {},
};

export default TicketUpdateModal;
