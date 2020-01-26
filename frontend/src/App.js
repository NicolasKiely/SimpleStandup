import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/login.css";
import "./static/channel-list.css";

import StandupIndex from "./components/standup-index.component";
import LoginRegisterForm from "./components/standup-login.component";

class App extends Component {
  constructor() {
    super();

    let first_token = localStorage.getItem("login_token");
    let first_logged_in;

    if (first_token){
      console.log("Logged in with token " + first_token);
      first_logged_in = true;
    } else {
      console.log("Not logged in yet");
      first_logged_in = false;
    }

    this.state = {
      logged_in: first_logged_in,
    };

    this.onLogin = function(user_email, token){
      console.log('Login callback called for user: ' + user_email);
      console.log('Login token: ' + token);
      this.setState({logged_in: true});
      localStorage.setItem("login_token", token);
    };
    this.onLogin = this.onLogin.bind(this);

    this.onLogout = function(){
      console.log("Logging out ...");
      localStorage.removeItem("login_token");
      this.setState({logged_in: false});
    };
    this.onLogout = this.onLogout.bind(this);
  }

  render() {
    let nav_bar = (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" className="navbar-brand">SimpleStandup</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link btn btn-link">Index</Link>
            </li>
            <li className="navbar-item">
              <button type="button" href="#"
                      className="nav-link btn btn-link" onClick={this.onLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    );

    let routes = [
      <Route path="/login" key="/login">
        <div style={{marginTop: 10}}>
          <div className="row">
            <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
              <LoginRegisterForm onLogin={this.onLogin}/>
            </div>
          </div>
        </div>
      </Route>,
      <Route path="/" exact key="/">
        <StandupIndex />
      </Route>
    ];
    if (!this.state.logged_in){
      routes.push(<Redirect to="/login" key="login-redirect"/>);
    }

    let body = (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-10 offset-md-1 offset-lg-1">
            {routes}
          </div>
        </div>
      </div>
    );

    return (
      <Router>
        <div className="container">
          {nav_bar}
          {body}
        </div>
      </Router>
    );
  }
}

export default App;
