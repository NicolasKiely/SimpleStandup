import React, {Component} from 'react';
import LoginRegisterForm from "./standup-login.component"


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
    };

    this.onLogin = function(user_email, token){
      console.log('Login callback called for user: ' + user_email);
      console.log('Login token: ' + token);
    }
  }

  render() {
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