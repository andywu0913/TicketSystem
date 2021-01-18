import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Image, Tab, Tabs } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import Axios from 'axios';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const self = this;
    const { id } = self.props.match.params;
    Axios.get(`http://localhost:3000/api/event/${id}`, {
    })
      .then((response) => {
        const { data } = response.data;
        self.setState({ ...data });
        console.log(data);
      })
      .catch((error) => {

      });
  }

  render() {
    return (
      <Container className="p-3">
        <Row>
          <Col>
            {this.state.name
              ? <h1 className="text-dark">{this.state.name}</h1>
              : (
                <ContentLoader width="100%" height="40">
                  <rect x="0" y="0" rx="10" ry="10" width="80%" height="100%" />
                </ContentLoader>
              )}
            <hr />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4} lg={4} className="mb-4">
            <Image src="https://static.tixcraft.com/images/activity/20_MAYDAY_8987933be02c14b4d8048f5fb91c1fab.jpg" rounded fluid />
          </Col>
          <Col xs={12} md={8} lg={8} className="mb-4">
            <Row>
              <Col>
                <Tabs>
                  <Tab eventKey="session" title="Session" disabled>
                    {this.state.name
                      ? <p className="text-dark">12345678654sdaf;lajsdf a;sdlfj asd;fjasdflj asdfl;jk af as;lkdf sa;f </p>
                      : (
                        <ContentLoader width="100%" height="40">
                          <rect x="0" y="0" rx="10" ry="10" width="80%" height="100%" />
                        </ContentLoader>
                      )}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Row>
              <Col>
                <h2 className="text-dark">Info</h2>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                {this.state.description
                  ? <div dangerouslySetInnerHTML={{ __html: this.state.description }} />
                  : (
                    <ContentLoader width="100%" height="150">
                      <rect x="0" y="0" rx="5" ry="50" width="95%" height="20" />
                      <rect x="0" y="35" rx="5" ry="50" width="70%" height="20" />
                      <rect x="0" y="70" rx="5" ry="50" width="90%" height="20" />
                      <rect x="0" y="105" rx="5" ry="50" width="60%" height="20" />
                    </ContentLoader>
                  )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

function sessions() {
  
}

export default Event;
