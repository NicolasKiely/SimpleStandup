import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./static/login.css";

import StandupIndex from "./components/standup-index.component";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">SimpleStandup</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Index</Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12 col-md-10 col-lg-10 offset-md-1 offset-lg-1">
                <Route path="/" exact component={StandupIndex} />
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
