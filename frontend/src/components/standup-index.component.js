import React, {Component} from 'react';


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    let first_token = localStorage.getItem("login_token");
    let first_logged_in = !!first_token;

    this.state = {
      logged_in: first_logged_in,
      display_new_channel_form: false
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
      this.setState(
        {display_new_channel_form: !this.state.display_new_channel_form}
      );
    };
    this.onEditNewChannel = this.onEditNewChannel.bind(this);

    this.onCreateNewChannel = function(e){
      e.preventDefault();
      console.log("Create new channel");
    };
    this.onCreateNewChannel = this.onCreateNewChannel.bind(this);
  }

  render() {
    let main_body;
    main_body = <p>Logged in</p>;
    let display_new_channel_form_class = this.state.display_new_channel_form ?
      "channel-list-form" : "channel-list-form-hidden";
    let new_channel_button_text = this.state.display_new_channel_form ?
      "Cancel" : "Create New Channel";

    return (
      <div style={{marginTop: 10}}>
        <div className="channel-list-form-container">
          {main_body}

          <button type="button" className="btn btn-block btn-secondary" onClick={this.onEditNewChannel}>
            {new_channel_button_text}
          </button>

          <div className={display_new_channel_form_class}>
            <form onSubmit={this.onCreateNewChannel} className="form-horizontal">
              <div className="form-group row">
                <label className="col-sm-2 control-label">Channel Name:</label>
                <div className="col-sm-6">
                  <input name="channel-name" type="text" className="form-control"/>
                </div>

                <div className="form-group col-sm-2">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }
}