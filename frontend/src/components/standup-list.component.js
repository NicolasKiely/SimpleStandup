import React, {Component} from 'react';


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged_in: false,
      login_email: '',
      login_pass: '',
      register_email: '',
      register_pass: '',
      register_fname: '',
      register_lname: ''
    }
  }

  resetLoginRegisterState() {
    this.setState({
      login_email: '',
      login_pass: '',
      register_email: '',
      register_pass: '',
      register_fname: '',
      register_lname: ''
    });
  }

  onSubmitLogin(e) {
    e.preventDefault();

    console.log('Submitting login');

    this.resetLoginRegisterState();
  }

  onSubmitRegister(e) {
    e.preventDefault();

    console.log('Submitting register');

    this.resetLoginRegisterState()
  }

  onChangeLoginEmail(e) {
    this.setState({
      login_email: e.target.value
    });
  }

  onChangeLoginPass(){
    this.setState({
      login_pass: '',
      login_email: ''
    })
  }

  render() {
    return (
      <div style={{marginTop: 10}}>
        <p>Welcome to Standup Index Page!</p>

        <h3>Login</h3>
        <form onSubmit={this.onSubmitLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="text"
                   className="form-control"
                   onChange={this.onChangeLoginEmail}
            />
          </div>
          <div>
            <label>Password</label>
            <input type="password"
                   className="form-control"
                   onChange={this.onChangeLoginPass}
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

        <h3>Register</h3>
        <form onSubmit={this.onSubmitRegister}>
        </form>
      </div>
    )
  }
}