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
      this.setState({logged_in: true});
    };
    this.onLogin = this.onLogin.bind(this);
  }

  render() {
    const display_style = this.state.logged_in ? {display: 'none'} : {};
    return (
      <div style={{marginTop: 10}}>
        <div className="row" style={display_style}>
          <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
            <LoginRegisterForm onLogin={this.onLogin} />
          </div>
        </div>
      </div>
    );
  }
}