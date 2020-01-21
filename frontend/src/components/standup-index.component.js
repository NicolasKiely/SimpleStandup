import React, {Component} from 'react';
import LoginRegisterForm from "./standup-login.component"


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

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
  }

  render() {
    if (this.state.logged_in){
      return (
        <div style={{marginTop: 10}}>
          <div className="row">
            <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">

            </div>
          </div>
        </div>
      )

    } else {
      return (
        <div style={{marginTop: 10}}>
          <div className="row">
            <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
              <LoginRegisterForm onLogin={this.onLogin} />
            </div>
          </div>
        </div>
      );
    }
  }
}