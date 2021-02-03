import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import PageNotFound from 'SRC/commons/PageNotFound';
import Event from 'SRC/domain/Event';
import Home from 'SRC/domain/Home';
import ManageEvent from 'SRC/domain/Manage/Event';
import ManageEventCreate from 'SRC/domain/Manage/Event/Create';
import ManageEventUpdate from 'SRC/domain/Manage/Event/Update';
import ManageSessionAudiance from 'SRC/domain/Manage/Session/Audiance';
import ManageSessionCreate from 'SRC/domain/Manage/Session/Create';
import ManageSessionUpdate from 'SRC/domain/Manage/Session/Update';
import ManageTicket from 'SRC/domain/Manage/Ticket';
import ManageUser from 'SRC/domain/Manage/User';
import Profile from 'SRC/domain/User/Profile';
import SignIn from 'SRC/domain/User/SignIn';
import SignInGitHub from 'SRC/domain/User/SignIn/GitHub';
import SignUp from 'SRC/domain/User/SignUp';
import Footer from 'SRC/Footer';
import Header from 'SRC/Header';
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
            <AuthRoute path="/manage/session/create" exact allowRole={[1, 2]} rejectToURL="/" component={ManageSessionCreate} />
            <AuthRoute path="/manage/session/:id/edit" exact allowRole={[1, 2]} rejectToURL="/" component={ManageSessionUpdate} />
            <AuthRoute path="/manage/session/:id/audiance" exact allowRole={[1, 2]} rejectToURL="/" component={ManageSessionAudiance} />
            <AuthRoute path="/manage/ticket" exact allowRole={[1, 2, 3]} rejectToURL="/user" component={ManageTicket} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}
