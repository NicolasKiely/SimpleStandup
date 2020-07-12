import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import ReactGA from 'react-ga';
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/login.css";
import "./static/channel-list.css";
import "./static/channel-panel.css";
import StandupIndex from "./components/standup-index.component";
import LoginRegisterForm from "./components/standup-login.component";
import AppNavbar from "./components/standup-nav.component";
import ToastNotification from "./components/notification-form.component";
import {backend_request} from "./utils";


class App extends Component {
  constructor() {
    super(undefined);

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
      prefer_login: false,
      activeNotificationID: undefined
    };
    this.gaID = "";
    this.notifications = {};
    this.channelUpdater = function(){console.log("No channel updater")};

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
      /* Clear notifications */
      this.updateNotificationCallers([], "");
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

    this.oldNotificationHash = "";
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
          const noteData = response.data.payload;
          const notes = noteData["notifications"];
          if (notes.length){
            setTimeout(this.notificationHandler, nextTimeout/2);
          } else {
            setTimeout(this.notificationHandler, nextTimeout*2);
          }
          this.updateNotificationCallers(notes, noteData["hash"]);
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


    this.registerNotificationCallback = function(callback){
      this.notificationCallers.push(callback);
    };
    this.registerNotificationCallback = this.registerNotificationCallback.bind(this);
    this.notificationCallers = [];
    this.globalNotificationCallback = function(notes){
      this.notifications = {};
      for (const note of notes){
        this.notifications[note["id"]] = note;
      }
    };
    this.globalNotificationCallback = this.globalNotificationCallback.bind(this);
    this.registerNotificationCallback(this.globalNotificationCallback);


    /* Determing if notifications has changed since last request */
    this.updateNotificationCallers = function(notes, noteHash){
      if (this.oldNotificationHash !== noteHash) {
        for (const caller of this.notificationCallers) {
          caller(notes);
        }
      }
      this.oldNotificationHash = noteHash;
    };
    this.updateNotificationCallers = this.updateNotificationCallers.bind(this);

    this.activateNotification = function(noteNum){
      this.setState({activeNotificationID: noteNum});
    };
    this.activateNotification = this.activateNotification.bind(this);

    this.setChannelUpdater = function(callback){
      this.channelUpdater = callback;
    };
    this.setChannelUpdater = this.setChannelUpdater.bind(this);

    /* Process server-side configs */
    backend_request(
      "/api/1/config", this.global_handler, "GET",
      undefined, undefined
    ).then(
      (response) => {
        const config = response.data.payload;
        this.gaID = config.google_analytics.id;
        console.log(`GA ID: "${this.gaID}"`);

        if (this.gaID){
          ReactGA.initialize(this.gaID);
          ReactGA.pageview("/");
        } else {
          console.log("Running mocked google analytics");
          ReactGA.initialize(this.gaID, {testMode: true});
        }
      },
      () => {console.log("Failed to load server configs!")}
    );
  }

  render() {
    let nav_bar = <AppNavbar app={this} />;

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
                      global_handler={this.global_handler} app={this}
        />
      </Route>
    ];
    if (!this.state.logged_in){
      routes.push(<Redirect to="/login" key="login-redirect"/>);
    }

    const activeNotification = this.state.activeNotificationID !== undefined ?
      this.notifications[this.state.activeNotificationID] :
      undefined
    ;
    const notificationDisplay = activeNotification !== undefined ?
      <ToastNotification app={this} notification={activeNotification}/> : undefined
    ;

    let body = (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-10 col-lg-10 offset-md-1 offset-lg-1">
            <div className="d-flex justify-content-center align-items-center">
              {notificationDisplay}
            </div>
          </div>
        </div>
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
