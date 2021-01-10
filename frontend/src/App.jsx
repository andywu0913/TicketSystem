import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import PageNotFound from './PageNotFound';
import Footer from './Footer';

import 'bootstrap/dist/css/bootstrap.min.css';

import SignIn from './SignIn';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Header />

        <Switch>
          <Route path="/" exact><Home /></Route>
          <Route path="/signin"><SignIn /></Route>
          <Route><PageNotFound /></Route>
        </Switch>

        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
