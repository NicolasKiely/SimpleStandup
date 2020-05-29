import React, {Component} from 'react';
import {backend_request} from "../utils";

/**
 * Channel tab for index
 */
export default class ChannelIndexTab extends Component {
  constructor(props) {
    super(props);

    this.channel_id = props.channel_id;
    const update_list_callback = props.update_list_callback;
    this.displayError = props.display_error;

    this.state = {
      archived: props.archived,
      channel_name: props.channel_name,
      channel_owner: props.channel_owner,
      user_email: props.user_email,
      user_token: props.user_token,
      expanded: false
    };

    /* Callback for tab being clicked */
    this.onClick = function(){
      this.setState({expanded: !this.state.expanded});
    };
    this.onClick = this.onClick.bind(this);

    /* Callback for archiving tab */
    this.onArchive = function(){
      const channel_path = "/api/1/channels/" + this.channel_id;
      console.log("Archiving channel " + this.channel_id);
      const header = {
        user_email: this.state.user_email, user_token: this.state.user_token,
      };

      backend_request(
        channel_path, props.global_handler, "DELETE", undefined, header
      ).then(
        () => {
          console.log("Archived channel!");
          update_list_callback();
        },
        err => {
          console.log("Failed to archive channel " + props.channel_id);
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to archive channel";
          this.displayError(error_msg);
        }
      );
    };
    this.onArchive = this.onArchive.bind(this);

    /* Callback for unarchiving tab */
    this.onUnarchive = function(){
      console.log("Unarchiving channel " + this.channel_id);
      const send_data = {
        user_email: this.state.user_email, user_token: this.state.user_token,
        channel_name: this.state.channel_name
      };

      backend_request("/api/1/channels", props.global_handler, "PUT", send_data).then(
        () => {
          console.log("Unarchived channel!");
          this.setState({error_msg: "", display_new_channel_form: false});
          update_list_callback();
        },
        err => {
          console.log("Failed to unarchive channel");
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to unarchive channel";
          this.displayError(error_msg);
        }
      );
    };
    this.onUnarchive = this.onUnarchive.bind(this);
  }

  render(){
    const isOwner = this.state.channel_owner === this.state.user_email;
    const expanded = this.state.expanded;
    const wrapperClass = expanded ?
      "channel-tab-wrapper channel-tab-wrapper-expanded" :
      "channel-tab-wrapper channel-tab-wrapper-collapsed"
    ;
    const channelOwnerSpan = isOwner ?
      null :
      <span className="channel-tab-owner"> - {this.state.channel_owner}</span>
    ;
    let channelTabDetails;
    if (expanded){
      /* Showing expanded details */
      const archiveBtn = (
        <div className="col-1 offset-10">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={this.state.archived ? this.onUnarchive : this.onArchive}
          >
            {this.state.archived ? "Unarchive" : "Archive"}
          </button>
        </div>
      );
      channelTabDetails = (
        <div className="row">
          <div className="col-sm-12">
            {archiveBtn}
          </div>
        </div>
      );
    } else {
      /* Tab is collapsed */
      channelTabDetails = null;
    }

    return (
      <div className={wrapperClass} onClick={this.onClick}>
        <div className="row">
          <div className="col-sm-12">
            <span className="channel-tab-title">Channel: {this.state.channel_name}</span>
            {channelOwnerSpan}
          </div>
        </div>
        {channelTabDetails}
      </div>
    );
  }
}
