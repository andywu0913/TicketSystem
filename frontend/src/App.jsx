import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageNotFound from './PageNotFound';
import Home from './Home/Home';
import Event from './Event/Event';
import User from './User/User';
import SignIn from './User/SignIn';
import SignUp from './User/SignUp';
import ManageUser from './Manage/User';
import ManageTicket from './Manage/Ticket';
import Axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

class App extends Component {
  constructor(props) {
    super(props);
    JWTUpdateTimer();
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

function JWTUpdateTimer() {
  let exp = localStorage.getItem('expires_in');
  
  if(!exp) {
    localStorage.clear();
    return;
  }

  exp = new Date(parseInt(exp));

  setInterval(() => {
    if(exp - new Date() < 0) {
      let accessToken = localStorage.getItem('access_token');
      let refreshToken = localStorage.getItem('refresh_token');
      
      Axios.post('http://localhost:3000/api/user/refresh', {
        'refresh_token': refreshToken
      }, {
        headers: {
        Authorization: 'Bearer ' + accessToken
      }})
      .then(function(response) {
        let data = response.data.data;
        localStorage.setItem('access_token', data['access_token']);
        localStorage.setItem('refresh_token', data['refresh_token']);

        exp = new Date();
        exp.setSeconds(exp.getSeconds() + data['expires_in']);
        localStorage.setItem('expires_in', exp.getTime());
      })
      .catch(function(error) {

      });
    }
  }, 5000);
}

function AuthRoute(props) {
  let {allowRole = [], rejectToURL = '/', ...params} = props;
  let role = parseInt(localStorage.getItem('role') || -1); // -1 means guest

  if(allowRole.includes(role))
    return <Route {...params} />;

  return <Redirect to={rejectToURL} />;
}

export default App;
