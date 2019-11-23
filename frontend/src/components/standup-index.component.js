import React, {Component} from 'react';
import {LoginForm, RegisterForm} from "./standup-login.component"


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.register_component = new RegisterForm();

    this.state = {
      logged_in: false,
    }
  }

  render() {
    return (
      <div style={{marginTop: 10}}>
        <p>Welcome to Standup Index Page!</p>

        <span>Login</span> | <span>Register</span>
        <LoginForm />
        <RegisterForm />
      </div>
    );
  }
}