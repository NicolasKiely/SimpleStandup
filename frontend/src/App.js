import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/login.css";
import "./static/channel-list.css";

import StandupIndex from "./components/standup-index.component";
import LoginRegisterForm from "./components/standup-login.component";
import {backend_request} from "./utils";

class App extends Component {
  constructor() {
    super();

    let first_token = localStorage.getItem("login_token");
    let first_logged_in;
    let first_email = localStorage.getItem("login_email");

    if (first_token){
      first_logged_in = true;
    } else {
      first_logged_in = false;
      first_email = undefined;
      first_token = undefined;
    }

    this.state = {
      logged_in: first_logged_in,
      user_email: first_email,
      user_token: first_token,
      prefer_login: false
    };

    this.onLogin = function(user_email, token){
      console.log(`Logging in ${user_email} with token ${token}`);
      this.setState(
        {logged_in: true, user_email: user_email, user_token: token}
      );
      localStorage.setItem("login_token", token);
      localStorage.setItem("login_email", user_email);
    };
    this.onLogin = this.onLogin.bind(this);

    this.onLogout = function(){
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
        const status = event.response ? event.response.status : 0;
        if (status === 401 && this.state.logged_in){
          // Token expired
          this.setState({logged_in: false, prefer_login: true});
        }
      }
    };
    this.global_handler = this.global_handler.bind(this);

    /**
     * Notification fetcher
     */
    this.notificationHandler = function(timeout){
      let nextTimeout = timeout || 4000;
      nextTimeout = Math.min(nextTimeout, 16000);
      nextTimeout = Math.max(nextTimeout, 2000);
      if (!this.state.logged_in){
        setTimeout(this.notificationHandler, nextTimeout*2);
        return;
      }
      const header = {
        user_email: this.state.user_email,
        user_token: this.state.user_token
      };
      backend_request(
        "/api/1/notifications/unread", this.global_handler, "GET",
        undefined, header
      ).then(
        (response) => {
          const notes = response.data.payload;
          if (notes.length){
            setTimeout(this.notificationHandler, nextTimeout/2);
          } else {
            setTimeout(this.notificationHandler, nextTimeout*2);
          }
        },
        err => {
          console.log("Failed to get notifications");
          const errorMsg = err.response && err.response.data ?
            err.response.data.message: "Failed to fetch notifications";
          console.log(errorMsg);
          setTimeout(this.notificationHandler, nextTimeout * 2);
        }
      );
    };
    this.notificationHandler = this.notificationHandler.bind(this);
    this.notificationHandler();
  }

  render() {
    let nav_bar = (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" className="navbar-brand">Standard Standup</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="navbar-item">
              <Link to="/" className="nav-link btn btn-link">Index</Link>
            </li>
            <li className="navbar-item">
              <button type="button"
                      className="nav-link btn btn-link"
              >
                Notifications
              </button>
            </li>
          </ul>
          <ul className="navbar-nav">
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
              <LoginRegisterForm onLogin={this.onLogin} prefer_login={this.state.prefer_login}/>
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
