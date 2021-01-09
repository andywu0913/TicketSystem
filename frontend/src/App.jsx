import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Header from './Header';
import Content from './Content';
import PageNotFound from './PageNotFound';
import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.min.css';

import SignIn from './SignIn';

class App extends Component {
  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
    this.signout = this.signout.bind(this);
    this.state = {name: null, role: null};
  }

  signin(name, role) {
    this.setState({name: name, role: role});
  }

  signout() {
    this.setState({name: null, role: null});
  }


  render() {
    return (
      <BrowserRouter>
        <Header name={this.state.name} role={this.state.role} signout={this.signout} />

        <Switch>
          <Route path="/" exact><Content /></Route>
          <Route path="/signin"><SignIn signin={this.signin} /></Route>
          <Route><PageNotFound /></Route>
        </Switch>

        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
