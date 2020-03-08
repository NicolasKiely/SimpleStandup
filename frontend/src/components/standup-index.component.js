/**
 * Top level index components
 */
import React, {Component} from 'react';
import {backend_request} from "../utils";
import ChannelIndexTab from "./standup-channel-tab";


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      display_new_channel_form: false,
      user_email: props.user_email,
      user_token: props.user_token,
      channel_name: "",
      error_msg: "",
      channels: [],
      filtering: {"subscribed": true, "my": false, "archive": false}
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

    /* Channel name field handler */
    this.onChangeChannelName = function(e){
      this.setState({channel_name: e.target.value});
    };
    this.onChangeChannelName = this.onChangeChannelName.bind(this);

    /* Fetch existing channels for user */
    this.fetch_channels = function(){
      const header = {
        user_email: this.state.user_email,
        user_token: this.state.user_token
      };
      backend_request("/api/1/channels", props.global_handler, "GET", undefined, header).then(
        (response) => {
          console.log("Got results:");
          console.log(response.data.payload);
          this.setState({"channels": response.data.payload});
        },
        err => {
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to fetch list of channels";
          this.setState({error_msg: error_msg});
        }
      );
    };
    this.fetch_channels();
  }

  render() {
    const display_new_channel_form_class = this.state.display_new_channel_form ?
      "channel-list-form" : "channel-list-form-hidden";
    const new_channel_button_text = this.state.display_new_channel_form ?
      "Cancel" : "Create New Channel";
    const new_channel_button_class = this.state.display_new_channel_form ?
      "btn btn-block btn-outline-secondary" : "btn btn-block btn-secondary";
    const error_msg = this.state.error_msg;

    const subscribedFilterDivClass = (
      "channel-list-filter-left channel-list-filter " + (
      this.state.filtering.subscribed ?
        "channel-list-filter-active" :
        "channel-list-filter-inactive"
      )
    );
    const myFilterDivClass = (
      "channel-list-filter-middle channel-list-filter " + (
        this.state.filtering.my ?
          "channel-list-filter-active" :
          "channel-list-filter-inactive"
      )
    );
    const archiveFilterDivClass = (
      "channel-list-filter-right channel-list-filter " + (
        this.state.filtering.archive ?
          "channel-list-filter-active" :
          "channel-list-filter-inactive"
      )
    );

    /* Top tabs to filter channels */
    const filtering_tabs = (
      <div className="channel-list-filter-wrapper">
        <div className="row no-gutters">
          <div className="col-4">
            <div className={subscribedFilterDivClass}>
              <span className="channel-list-filter-header">Subscribed Channels</span>
            </div>
          </div>
          <div className="col-4">
            <div className={myFilterDivClass}>
              <span className="channel-list-filter-header">My Channels</span>
            </div>
          </div>
          <div className="col-4">
            <div className={archiveFilterDivClass}>
              <span className="channel-list-filter-header">Archived Channels</span>
            </div>
          </div>
        </div>
      </div>
    );

    /* Show error alert if there is an error */
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
      );
    }

    /* Create list of channels */
    let channel_divs = [];
    for (const channel of this.state.channels){
      const channel_name = channel["channel_name"];
      const channel_owner = channel["owner"];
      const user_email = this.state["user_email"];
      channel_divs.push(
        <ChannelIndexTab key={channel_name} channel_name={channel_name}
                         channel_owner={channel_owner} user_email={user_email}
        />
      );
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
          {filtering_tabs}
          <div className="channel-list-form-padded-container">
            {error_div}
          </div>

          {channel_divs}
          <div className="channel-list-form-padded-container">
            {new_channel_form}
          </div>
        </div>
      </div>
    );
  }
}