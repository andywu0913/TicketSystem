import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import PageNotFound from './PageNotFound';
import Footer from './Footer';
import Event from './Event';
import User from './User/User';
import SignIn from './User/SignIn';
import SignUp from './User/SignUp';

import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';


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
            <Route path="/user" exact component={User} />
            <Route path="/user/signin" component={SignIn} />
            <Route path="/user/signup" component={SignUp} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
