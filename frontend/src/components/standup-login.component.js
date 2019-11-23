import React, {Component} from 'react';


class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePass = this.onChangePass.bind(this);

    this.state = {
      email: '',
      pass: ''
    }
  }

  onSubmit(e) {
    e.preventDefault();

    console.log('Submitting login');

    this.setState({
      email: '',
      pass: ''
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePass(e){
    this.setState({
      pass: e.target.value,
    });
  }

  render(){
    return (
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
    );
  }
}


class RegisterForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: '',
      pass: '',
      fname: '',
      lname: ''
    };
  }

  onSubmitRegister(e) {
    e.preventDefault();

    this.setState({
      email: '',
      pass: '',
      fname: '',
      lname: ''
    });

    console.log('Submitting register');
  }

  onChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  onChangePass(e){
    this.setState({
      pass: e.target.value
    })
  }

  onChangeFName(e){
    this.setState({
      fname: e.target.value
    });
  }

  onChangeLName(e){
    this.setState({
      lname: e.target.value
    })
  }

  render() {
    return (
      <form onSubmit={this.onSubmitRegister}>
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
        <div>
          <label>First Name</label>
          <input type="text"
                 className="form-control"
                 onChange={this.onChangeFName}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text"
                 className="form-control"
                 onChange={this.onChangeLName}
          />
        </div>
      </form>
    );
  }
}


export {LoginForm, RegisterForm};
