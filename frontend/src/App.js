import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import StandupIndex from "./components/standup-list.component";

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
          <Route path="/" exact component={StandupIndex} />
        </div>
      </Router>
    );
  }
}

export default App;
