import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, FormControl, Row, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ClockFill, GearFill, GeoAltFill } from 'react-bootstrap-icons';
import Axios from 'axios';
import Swal from 'sweetalert2';

export default function ContentFrame() {
  return (
    <Container className="p-3">
      <Row>
        <Col>
          <h1 className="text-dark">My Tickets</h1>
          <hr />
        </Col>
      </Row>
      <TicketCardList />
    </Container>
  );
}

class TicketCardList extends Component {
  constructor(props) {
    super(props);
    this.showUpdateTicketModal = this.showUpdateTicketModal.bind(this);
    this.hideUpdateTicketModal = this.hideUpdateTicketModal.bind(this);
    this.loadData = this.loadData.bind(this);
    this.state = { data: [], showUpdateTicketModal: false, selectedTicketId: null, selectedSeat: null };
  }

  componentDidMount() {
    this.loadData();
  }

  showUpdateTicketModal(ticketId, seat) {
    this.setState({ showUpdateTicketModal: true, selectedTicketId: ticketId, selectedSeat: seat });
  }

  hideUpdateTicketModal() {
    this.setState({ showUpdateTicketModal: false });
  }

  loadData() {
    const self = this;
    Axios.get('http://localhost:3000/api/ticket', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then((response) => {
      self.setState({ data: response.data.data });
    })
    .catch((error) => {

    });
  }

  render() {
    const { data } = this.state;
    if (data.length === 0) {
      return <Empty />;
    }
    return (
      <Fragment>
        {data.map((ticket) => <TicketCard key={ticket.id} data={ticket} updateTicket={this.showUpdateTicketModal} />)}
        <UpdateTicketModal ticketId={this.state.selectedTicketId} seat={this.state.selectedSeat} reload={this.loadData} show={this.state.showUpdateTicketModal} hideModal={this.hideUpdateTicketModal} />
      </Fragment>
    );
  }
}

function TicketCard(props) {
  const { data } = props;
  console.log(data);
  return (
    <Row className="mb-4">
      <Col>
        <Card>
          <Container>
            <Row>
              <Col sm={12} md={6} lg={3} className="pl-0 pr-0">
                <img className="" src="http://via.placeholder.com/300x180" alt="" width="100%" height="auto" />
              </Col>
              <Col sm={12} md={6} lg={4} className="pl-0 pr-0">
                <Card.Body className="p-3">
                  <Card.Title>
                    <Link to={`/event/${data.event_id}`} className="text-reset">
                      <h4 className="text-dark">{data.name}</h4>
                    </Link>
                  </Card.Title>
                  <Card.Text>
                    <GeoAltFill className="text-muted" /> {data.address}
                  </Card.Text>
                  <Card.Text>
                    <ClockFill className="text-muted" /> {new Date(data.time).toLocaleString()}
                  </Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>Seat No. {data.seat_no}</Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>Price {data.price}</Card.Text>
                </Card.Body>
              </Col>
              <Col sm={12} md={12} lg={1} className="align-self-center text-center p-2">
              {data.session_is_active
              ? <Link to="#" onClick={() => props.updateTicket(data.id, data.seat_no)} className="text-reset">
                  <GearFill className="text-muted" size="1.25rem" />
                </Link>
              : <OverlayTrigger overlay={<Tooltip>Cannot modify this ticket right now. The event host has locked this session.</Tooltip>}>
                  <GearFill className="text-light" size="1.25rem" />
                </OverlayTrigger>
              } 
              </Col>
            </Row>
          </Container>
        </Card>
      </Col>
    </Row>
  );
}

class UpdateTicketModal extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = { ticketId: null, seat: null, changed: false };
  }

  static getDerivedStateFromProps(props, state) {
    if(props.ticketId !== state.ticketId) {
      let { ticketId, seat } = props;
      return { ticketId, seat, changed: false };
    }
    return null;
  }

  handleChange(event) {
    let seat = event.target.value;
    this.setState({ seat, changed: true });
  }

  handleUpdate(event) {
    let { ticketId, seat } = this.state;
    Axios.put(`http://localhost:3000/api/ticket/${ticketId}`, {
      seat_no: parseInt(seat)
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
    .then((response) => {
      this.props.reload();
      this.setState({ changed: false });
      this.props.hideModal();
      Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
    })
    .catch((error) => {
      if(error.response && error.response.data) {
        let message = error.response.data.error_msg || '';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
        return;
      }
      Swal.fire({icon: 'error', title: 'Error', text: 'Unknown error.'});
    });
  }

  handleDelete(event) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (!result.isConfirmed) 
        return;
      const { ticketId } = this.state;
      Axios.delete(`http://localhost:3000/api/ticket/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .then((response) => {
        this.props.reload();
        this.setState({ changed: false });
        this.props.hideModal();
        Swal.fire({ icon: 'success', title: 'Success', showConfirmButton: false, timer: 1000 });
      })
      .catch((error) => {
        if(error.response && error.response.data) {
          const message = error.response.data.error_msg || '';
          Swal.fire({ icon: 'error', title: 'Error', text: message });
          return;
        }
        Swal.fire({ icon: 'error', title: 'Error', text: 'Unknown error.' });
      });
    });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.hideModal} size="sm" centered>
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
                <FormControl name="seat" size="lg" type="text" value={this.state.seat} onChange={this.handleChange} />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={this.handleDelete}>Delete ticket</Button>
          <Button variant="success" disabled={!this.state.changed} onClick={this.handleUpdate}>Update seat</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function Empty() {
  return (
    <Row className="m-5 p-5 text-center text-muted">
      <Col>
        <h6>No available tickets currently.</h6>
      </Col>
    </Row>
  );
}
