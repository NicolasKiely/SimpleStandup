import React, {Component} from 'react';


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    let first_token = localStorage.getItem("login_token");
    let first_logged_in;
    if (first_token){
      first_logged_in = true;
    } else {
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

    this.onEditNewChannel = function(){
      console.log("Setup new channel");
    };
    this.onEditNewChannel = this.onEditNewChannel.bind(this);

    this.onCreateNewChannel = function(){
      console.log("Create new channel");
    }
    this.onCreateNewChannel = this.onCreateNewChannel.bind(this);
  }

  render() {
    let main_body;
    main_body = <p>Logged in</p>;

    return (
      <div style={{marginTop: 10}}>
        <div className="channel-list-form">
          {main_body}

          <button type="button" className="btn btn-block btn-primary" onClick={this.onEditNewChannel}>
            Create New Channel
          </button>
          <form onSubmit={this.onCreateNewChannel}>

          </form>
        </div>
      </div>
    );
  }
}