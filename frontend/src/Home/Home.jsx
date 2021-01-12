import React, {Component} from 'react';
import {Card, Container, Row, Col} from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import {Link} from 'react-router-dom';
import Axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    let self = this;
    Axios.get('http://localhost:3000/api/event', {
    })
    .then(function(response) {
      self.setState({data: response.data.data});
    })
    .catch(function(error) {
      
    });
  }

  render() {
    return (
      <Container className="p-3">
        <Row className="justify-content-md-center">
          <Col xs={12} sm={12} lg={{span: 3, order: 'last'}}>
            <h1 className="text-dark">Categories</h1>
            <hr />
            <Categories categories={['Music', 'Movie', 'Drama', 'Sport', 'Talk Show', 'Others']} />
          </Col>
          <Col xs={12} sm={12} lg={{span: 9, order: 'first'}}>
            <h1 className="text-dark">Latest</h1>
            <hr />
              {this.state.data.length
                ? <EventCards data={this.state.data} />
                : <DefaultLoadingPlaceholder nums={8} />
              }
          </Col>
        </Row>
      </Container>
    );
  }
}

class Categories extends Component {
  render() {
    let cols = this.props.categories.map((category) =>
      <Col xs={4} sm={3} lg={6} className="mb-3" key={category}>{category}</Col>
    );
    
    return (
      <Row>{cols}</Row>
    );
  }
}

class DefaultLoadingPlaceholder extends Component {
  render() {
    let nums = this.props.nums || 10;
    let cards = Array.from(Array(nums).keys()).map((key) => 
      <Col xs={12} md={6} lg={6} className="mb-4" key={key}>
        <Card className="h-100">
          <ContentLoader width="100%" height="300">
            <rect x="0" y="0" rx="2" ry="2" width="100%" height="66%" /> 
            <rect x="2%" y="70%" rx="5" ry="5" width="96%" height="20" /> 
            <rect x="2%" y="80%" rx="5" ry="5" width="80%" height="20" />
            <rect x="2%" y="90%" rx="5" ry="5" width="40%" height="20" />
          </ContentLoader>
        </Card>
      </Col>
    );
    return (
      <Row>{cards}</Row>
    );
  }
}

class EventCards extends Component {
  render() {
    let events = this.props.data;
    let cards = events.map((event) => {
      let description = event.description.replace(/(<([^>]+)>)/gi, "");
      let start = new Date(event['start_date']).toLocaleDateString();
      let end = new Date(event['end_date']).toLocaleDateString();
      
      return (
        <Col xs={12} md={6} lg={6} className="mb-4" key={event.id}>
          <Card className="h-100">
            <Card.Img variant="left" src="http://via.placeholder.com/300x180" />
            <Card.Body>
              <Link to={`/event/${event.id}`} className="text-reset">
                <Card.Title>{event.name}</Card.Title>
                <Card.Text>
                  {description.length < 30 
                    ? description 
                    : `${description.substring(0, 30)}...`
                  }
                </Card.Text>
              </Link>
            </Card.Body>
            <Card.Footer className="pt-2 pb-2 text-right">
              <small className="text-muted">{start} ~ {end}</small>
            </Card.Footer>
          </Card>
        </Col>
      );
    }
    );
    return (
      <Row>{cards}</Row>
    );
  }
}

export default Home;
