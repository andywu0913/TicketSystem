import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Header from './Header';
import Home from './Home/Home';
import PageNotFound from './PageNotFound';
import Footer from './Footer';
import Event from './Event/Event';
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
            <AuthRoute path="/user" exact allowRole={[1, 2, 3]} rejectToURL="/user/signin" component={User} />
            <AuthRoute path="/user/signin" allowRole={[-1]} rejectToURL="/user" component={SignIn} />
            <AuthRoute path="/user/signup" allowRole={[-1]} rejectToURL="/user" component={SignIn} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

function AuthRoute(props) {
  let {allowRole = [], rejectToURL = '/', ...params} = props;
  let role = parseInt(localStorage.getItem('role') || -1); // -1 means guest

  if(allowRole.includes(role))
    return <Route {...params} />;

  return <Redirect to={rejectToURL} />;
}

export default App;
