import React, {Component} from 'react';
import axios from 'axios';
import {get_backend_url} from "../utils";


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display_new_channel_form: false,
      user_email: props.user_email,
      user_token: props.user_token
    };

    /* Click handler for opening/closing form for new channels */
    this.onEditNewChannel = function(){
      this.setState(
        {display_new_channel_form: !this.state.display_new_channel_form}
      );
    };
    this.onEditNewChannel = this.onEditNewChannel.bind(this);

    /* Handler for submiting request to create new channel */
    this.onCreateNewChannel = function(e){
      e.preventDefault();
      console.log("Creating new channel...");
      const send_data = {
        user_email: this.state.user_email, user_token: ""
      };

      const url = get_backend_url('/api/1/channels');
      axios.put(url, send_data).then(
        res => {
          console.log("Created new channel!");
        },
        err => {
          console.log("Failed to create channel");
          console.log(err);
        }
      )
    };
    this.onCreateNewChannel = this.onCreateNewChannel.bind(this);
  }

  render() {
    let main_body;
    main_body = <p>Logged in</p>;
    const display_new_channel_form_class = this.state.display_new_channel_form ?
      "channel-list-form" : "channel-list-form-hidden";
    const new_channel_button_text = this.state.display_new_channel_form ?
      "Cancel" : "Create New Channel";
    const new_channel_button_class = this.state.display_new_channel_form ?
      "btn btn-block btn-outline-secondary" : "btn btn-block btn-secondary";

    /* Form elements for creating new channel */
    const new_channel_form = <div>
      <button type="button" className={new_channel_button_class} onClick={this.onEditNewChannel}>
        {new_channel_button_text}
      </button>

      <div className={display_new_channel_form_class}>
        <form onSubmit={this.onCreateNewChannel} className="form-horizontal">
          <div className="form-group row">
            <label className="col-sm-2 control-label">Channel Name:</label>
            <div className="col-sm-8">
              <input name="channel-name" type="text" className="form-control"/>
            </div>

            <div className="form-group col-sm-2">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>;

    return (
      <div style={{marginTop: 10}}>
        <div className="channel-list-form-container">
          {main_body}

          {new_channel_form}
        </div>
      </div>
    );
  }
}