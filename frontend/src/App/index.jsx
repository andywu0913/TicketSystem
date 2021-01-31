import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Event from 'SRC/Event';
import Footer from 'SRC/Footer';
import Header from 'SRC/Header';
import Home from 'SRC/Home';
import ManageEvent from 'SRC/Manage/Event';
import ManageEventCreate from 'SRC/Manage/Event/Create';
import ManageEventUpdate from 'SRC/Manage/Event/Update';
import ManageTicket from 'SRC/Manage/Ticket';
import ManageUser from 'SRC/Manage/User';
import PageNotFound from 'SRC/PageNotFound';
import Profile from 'SRC/User/Profile';
import SignIn from 'SRC/User/SignIn';
import SignInGitHub from 'SRC/User/SignIn/GitHub';
import SignUp from 'SRC/User/SignUp';
import { setRenewTimer } from 'SRC/utils/jwt';

import AuthRoute from './AuthRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    setRenewTimer();
  }

  render() {
    return (
      <BrowserRouter>
        <Header />
        <div id="content">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/event/:id" exact component={Event} />
            <AuthRoute path="/user" exact allowRole={[1, 2, 3]} rejectToURL="/user/signin" component={Profile} />
            <AuthRoute path="/user/signin" exact allowRole={[-1]} rejectToURL="/user" component={SignIn} />
            <AuthRoute path="/user/signin/github/callback" exact allowRole={[-1]} rejectToURL="/user" component={SignInGitHub} />
            <AuthRoute path="/user/signup" exact allowRole={[-1]} rejectToURL="/user" component={SignUp} />
            <AuthRoute path="/manage/user" exact allowRole={[1]} rejectToURL="/" component={ManageUser} />
            <AuthRoute path="/manage/event" exact allowRole={[1, 2]} rejectToURL="/" component={ManageEvent} />
            <AuthRoute path="/manage/event/create" exact allowRole={[1, 2]} rejectToURL="/" component={ManageEventCreate} />
            <AuthRoute path="/manage/event/:id/edit" exact allowRole={[1, 2]} rejectToURL="/" component={ManageEventUpdate} />
            <AuthRoute path="/manage/ticket" exact allowRole={[1, 2, 3]} rejectToURL="/user" component={ManageTicket} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}
