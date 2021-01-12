import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { ClockFill, GearFill, GeoAltFill, TrashFill } from 'react-bootstrap-icons';
import Axios from 'axios';

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
    this.state = { data: [] };
  }

  componentDidMount() {
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
        {data.map((ticket) => <TicketCard key={ticket.id} data={ticket} />)}
      </Fragment>
    );
  }
}

function TicketCard(props) {
  const { data } = props;
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
                    <h4 className="text-dark">{data.name}</h4>
                  </Card.Title>
                  <Card.Text>
                    <GeoAltFill className="text-muted" /> {data.address}
                  </Card.Text>
                  <Card.Text>
                    <ClockFill className="text-muted" /> {data.time}
                  </Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>
                    Seat No. {data.seat_no}
                  </Card.Text>
                </Card.Body>
              </Col>
              <Col sm={6} md={6} lg={2} className="align-self-center text-center">
                <Card.Body className="p-3">
                  <Card.Text>
                    Price {data.price}
                  </Card.Text>
                </Card.Body>
              </Col>
              <Col sm={12} md={12} lg={1} className="align-self-center text-center p-2">
                <Link to={`/manage/ticket/${data.id}`} className="text-reset">
                  <GearFill className="text-muted" size="1.25rem" />
                </Link>
              </Col>
            </Row>
          </Container>
        </Card>
      </Col>
    </Row>
  );
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
