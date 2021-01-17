import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from 'SRC/Header';
import Footer from 'SRC/Footer';
import PageNotFound from 'SRC/PageNotFound';
import Home from 'SRC/Home';
import Event from 'SRC/Event/Event';
import User from 'SRC/User/User';
import SignIn from 'SRC/User/SignIn';
import SignUp from 'SRC/User/SignUp';
import ManageUser from 'SRC/Manage/User';
import ManageTicket from 'SRC/Manage/Ticket';

import AuthRoute from './AuthRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

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
            <Route path="/event/:id" exact component={Event} />
            <AuthRoute path="/user" exact allowRole={[1, 2, 3]} rejectToURL="/user/signin" component={User} />
            <AuthRoute path="/user/signin" exact allowRole={[-1]} rejectToURL="/user" component={SignIn} />
            <AuthRoute path="/user/signup" exact allowRole={[-1]} rejectToURL="/user" component={SignUp} />
            <AuthRoute path="/manage/user" exact allowRole={[1]} rejectToURL="/" component={ManageUser} />
            <AuthRoute path="/manage/ticket" exact allowRole={[1, 2, 3]} rejectToURL="/user" component={ManageTicket} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
