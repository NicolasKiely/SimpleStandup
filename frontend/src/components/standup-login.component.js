import React, {Component} from 'react';
import axios from 'axios';
import ReactGA from 'react-ga';
import {Redirect} from 'react-router-dom';
import {get_backend_url} from '../utils'


/**
 * Component for just login form
 */
class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.login_callback = props.onLogin;
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePass = this.onChangePass.bind(this);

    this.state = {
      email: '',
      pass: '',
      error_msg: '',
      redirect: false
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const send_data = {
      login_email: this.state.email,
      login_pass: this.state.pass
    };
    const url = get_backend_url('/api/1/auth/login');
    axios.post(
      url, send_data
    ).then(
      res => {
        if (res.data.payload.email){
          this.login_callback(res.data.payload.email, res.data.payload.token);
          this.setState({error_msg: '', redirect: true});
          ReactGA.event({
            category: 'User',
            action: 'Login'
          });

        } else {
          console.log("Could not log in");
          let error_msg = res.data.message || "Could not authenticate user";
          this.setState({error_msg: error_msg});
          ReactGA.event({
            category: 'User',
            action: 'Failed Login'
          });
        }
      },
      err => {
        if (err.response) {
          console.log("Failed to log in");
          this.setState({error_msg: err.response.data.message});
        } else {
          console.log("No error response");
          this.setState({error_msg: err})
        }
        ReactGA.event({
          category: 'User',
          action: 'Failed Login'
        });
      }
    );
  }

  onChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  onChangePass(e){
    this.setState({pass: e.target.value});
  }

  render(){
    const error_msg = '' + this.state.error_msg;
    const error_style = error_msg ? {} : {display: 'none'};
    const redirect_el = this.state.redirect
      ? [<Redirect to="/" key="login_redirect" />]
      : []
    ;

    return (
      <div>
        <div className="row" style={error_style}>
          <div className="col-12">
            <div className="alert alert-danger">
              {error_msg}
            </div>
          </div>
        </div>

        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="text"
                   className="form-control"
                   onChange={this.onChangeEmail}
            />
          </div>
          <div>
            <label>Password</label>
            <input type="password"
                   className="form-control"
                   onChange={this.onChangePass}
            />
          </div>
          <br />
          <div className="form-group">
            <input type="submit"
                   value="Login"
                   className="btn btn-primary btn-block"
            />
          </div>
        </form>
        {redirect_el}
      </div>
    );
  }
}


/**
 * Component for just register form
 */
class RegisterForm extends Component {
  constructor(props){
    super(props);

    this.loginCallback = props.onRegister;
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePass = this.onChangePass.bind(this);
    this.onChangeFName = this.onChangeFName.bind(this);
    this.onChangeLName = this.onChangeLName.bind(this);

    this.state = {
      email: '', pass: '', fname: '', lname: '',
      error_msg: '', redirect: false
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const send_data = {
      register_email: this.state.email,
      register_pass: this.state.pass,
      register_fname: this.state.fname,
      register_lname: this.state.lname
    };
    axios.post(
      get_backend_url('/api/1/auth/register'),
      send_data
    ).then(
      res => {
        ReactGA.event({
          category: 'User',
          action: 'Register Account'
        });
        this.loginCallback(res.data.payload.email, res.data.payload.token);
        this.setState({error_msg: ''});
        /* Try to login */
        const login_url = get_backend_url('/api/1/auth/login');
        const login_data = {
          login_email: this.state.email,
          login_pass: this.state.pass
        };
        axios.post(login_url, login_data).then(
          res => {
            if (res.data.payload.email){
              this.loginCallback(res.data.payload.email, res.data.payload.token);
              this.setState({error_msg: '', redirect: true});

            } else {
              console.log("Could not log in");
              let error_msg = res.data.message || "Could not authenticate user";
              this.setState({error_msg: error_msg});
            }
          }
        );
      },
      err => {
        if (err.response) {
          this.setState({error_msg: err.response.data.message});
        } else {
          this.setState({error_msg: err})
        }
      }
    );
  }

  onChangeEmail(e){
    this.setState({email: e.target.value})
  }

  onChangePass(e){
    this.setState({pass: e.target.value})
  }

  onChangeFName(e){
    this.setState({fname: e.target.value});
  }

  onChangeLName(e){
    this.setState({lname: e.target.value})
  }

  render() {
    const error_msg = '' + this.state.error_msg;
    const error_style = error_msg ? {} : {display: 'none'};
    const redirect_el = this.state.redirect ?
      <Redirect to="/" key="register_redirect" /> :
      null
    ;

    return (
      <div>
        <div className="row" style={error_style}>
          <div className="col-12">
            <div className="alert alert-danger">
              {error_msg}
            </div>
          </div>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="text"
                   className="form-control"
                   required="required"
                   onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password"
                   className="form-control"
                   onChange={this.onChangePass}
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input type="text"
                   className="form-control"
                   required="required"
                   onChange={this.onChangeFName}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text"
                   className="form-control"
                   onChange={this.onChangeLName}
            />
          </div>
          <br />
          <div className="form-group">
            <input type="submit"
                   value="Register"
                   className="btn btn-primary btn-block"
            />
          </div>
        </form>
        {redirect_el}
      </div>
    );
  }
}


/**
 * Combined selectable login/registration form with header
 */
class LoginRegisterForm extends Component {
  constructor(props) {
    super(props);

    this.onLogin = props.onLogin;
    this.onSelectLogin = this.onSelectLogin.bind(this);
    this.onSelectRegister = this.onSelectRegister.bind(this);

    this.state = {
      login_form_active: props.prefer_login,
      register_form_active: !props.prefer_login
    };
  }

  onSelectLogin() {
    this.setState({
      login_form_active: true,
      register_form_active: false
    })
  }

  onSelectRegister() {
    this.setState({
      login_form_active: false,
      register_form_active: true
    })
  }

  render() {
    /* Form body toggling */
    let login_form_style = this.state.login_form_active ? {} : {display: 'none'};
    let register_form_style = this.state.register_form_active ? {} : {display: 'none'};

    /* Form header toggling */
    let login_header_class = this.state.login_form_active ?
      "login-title-selector active-title-selector" :
      "login-title-selector inactive-title-selector";
    let register_header_class = this.state.register_form_active ?
      "register-title-selector active-title-selector" :
      "register-title-selector inactive-title-selector";

    return (
      <div className="login-register-form">
        <div className="login-register-header">
          <div className={login_header_class} onClick={this.onSelectLogin}>
            <span className="login-form-title login-register-form-title login-register-title-active">
              Login
            </span>
          </div>
          <div className={register_header_class} onClick={this.onSelectRegister}>
            <span className="register-form-title login-register-form-title"
                  onClick={this.onSelectRegister}
            >
              Register
            </span>
          </div>
        </div>

        <div className="login-register-body" style={login_form_style}>
          <LoginForm active="true" onLogin={this.onLogin} />
        </div>
        <div className="login-register-body" style={register_form_style}>
          <RegisterForm onRegister={this.onLogin}/>
        </div>
      </div>
    );
  }
}


export {LoginForm, RegisterForm};
export default LoginRegisterForm;
