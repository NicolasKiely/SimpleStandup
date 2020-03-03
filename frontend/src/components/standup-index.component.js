import React, {Component} from 'react';
import {backend_request} from "../utils";


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display_new_channel_form: false,
      user_email: props.user_email,
      user_token: props.user_token,
      channel_name: "",
      error_msg: ""
    };

    /* Click handler for opening/closing form for new channel */
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
        user_email: this.state.user_email, user_token: this.state.user_token,
        channel_name: this.state.channel_name
      };

      backend_request("/api/1/channel", props.global_handler, "PUT", send_data).then(
        () => {
          console.log("Created new channel!");
          this.setState({error_msg: "", display_new_channel_form: false});
        },
        err => {
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to create channel";
          this.setState({error_msg: error_msg});
        }
      )
    };
    this.onCreateNewChannel = this.onCreateNewChannel.bind(this);

    this.onChangeChannelName = function(e){
      this.setState({channel_name: e.target.value});
    };

    this.onChangeChannelName = this.onChangeChannelName.bind(this);
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
    const error_msg = this.state.error_msg;

    let error_div = <div/>;
    if (error_msg){
      error_div =(
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              {error_msg}
            </div>
          </div>
        </div>
      )
    }

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
              <input name="channel-name" type="text" className="form-control"
                     onChange={this.onChangeChannelName}
              />
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
          {error_div}

          {main_body}

          {new_channel_form}
        </div>
      </div>
    );
  }
}