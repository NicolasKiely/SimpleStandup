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
    let first_email = localStorage.getItem("login_email");

    if (first_token){
      console.log("Logged in "+ first_email +" with token " + first_token);
      first_logged_in = true;
    } else {
      console.log("Not logged in yet");
      first_logged_in = false;
      first_email = undefined;
      first_token = undefined;
    }

    this.state = {
      logged_in: first_logged_in,
      user_email: first_email,
      user_token: first_token
    };

    this.onLogin = function(user_email, token){
      console.log('Login callback called for user: ' + user_email);
      console.log('Login token: ' + token);
      this.setState(
        {logged_in: true, user_email: user_email, user_token: token}
      );
      localStorage.setItem("login_token", token);
      localStorage.setItem("login_email", user_email);
    };
    this.onLogin = this.onLogin.bind(this);

    this.onLogout = function(){
      console.log("Logging out ...");
      localStorage.removeItem("login_token");
      localStorage.removeItem("login_email");
      this.setState(
        {logged_in: false, user_email: undefined, user_token: undefined}
      );
    };
    this.onLogout = this.onLogout.bind(this);

    /** Global event handler for requests to backend */
    this.global_handler = function(event){
      if (event !== undefined){
        console.log("Global event handler status " + event);
      }
    }
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
        <StandupIndex user_email={this.state.user_email} user_token={this.state.user_token}
                      global_handler={this.global_handler}
        />
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
