import React, {Component} from 'react';
import {LoginForm, RegisterForm} from "./standup-login.component"


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
    }
  }

  render() {
    return (
      <div style={{marginTop: 10}}>
        <div className="row">
          <div className="col-sm-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
            <div className="login-register-form">
              <div className="login-register-header">
                <span className="login-form-title login-register-form-title login-register-title-active"
                >
                  Login
                </span>
                <span className="register-form-title login-register-form-title"
                >
                  Register
                </span>
              </div>

              <div className="login-register-body">
                <LoginForm />
              </div>
              <div className="login-register-body">
                <RegisterForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}