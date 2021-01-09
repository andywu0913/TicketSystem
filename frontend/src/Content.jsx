import React, {Component} from 'react';
import {Card, Container, Row, Col} from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import {Link} from 'react-router-dom';

class Content extends Component {

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} sm={12} lg={{span: 3, order: 'last'}}>
            <h1 className="text-dark">Categories</h1>
            <hr />
            <Row>
              <Col xs={4} sm={3} lg={5}>Music</Col>
              <Col xs={4} sm={3} lg={5}>Movie</Col>
              <Col xs={4} sm={3} lg={5}>Drama</Col>
              <Col xs={4} sm={3} lg={5}>Sport</Col>
              <Col xs={4} sm={3} lg={5}>Talk Show</Col>
              <Col xs={4} sm={3} lg={5}>Others</Col>
            </Row>
          </Col>
          <Col xs={12} sm={12} lg={{span: 9, order: 'first'}}>
            <h1 className="text-dark">Latest Events</h1>
            <hr />
            <Row>

              <Col xs={12} md={6} lg={6}>
                <Card>
                  <Card.Img variant="left" src="http://via.placeholder.com/300x180" />
                  <Card.Body>
                    <Card.Text>
                      Some quick example text to build on the card title and make up the bulk
                      of the card's content.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Card>
                  <Card.Img variant="left" src="http://via.placeholder.com/300x180" />
                  <Card.Body>
                    <Card.Text>
                      Some quick example text to build on the card title and make up the bulk
                      of the card's content.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Card>
                  <Card.Img variant="left" src="http://via.placeholder.com/300x180" />
                  <Card.Body>
                    <Card.Text>
                      Some quick example text to build on the card title and make up the bulk
                      of the card's content.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={6}>
                <Card>
                  
                  <Loading />
                  123
                </Card>
              </Col>
              
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

function Loading() {
  return (
    <ContentLoader>
      <rect x="0" y="0" rx="2" ry="2" width="100%" height="100%" /> 
      <rect x="10" y="110" rx="2" ry="2" width="100%" height="10" /> 
      <rect x="10" y="130" rx="2" ry="2" width="100%" height="10" />
      <rect x="10" y="145" rx="2" ry="2" width="75%" height="10" />
    </ContentLoader>
  );
}

export default Content;
