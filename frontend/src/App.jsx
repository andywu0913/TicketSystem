import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import PageNotFound from './PageNotFound';
import Footer from './Footer';
import Event from './Event';

import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

import SignIn from './SignIn';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Header />
        <div id="content">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/event/:id" component={Event} />
            <Route path="/signin" component={SignIn} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
