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
      expanded: false,
      active_form: ""
    };

    /* Callback for tab being clicked */
    this.onClick = function(){
      this.setState({expanded: !this.state.expanded, active_form: ""});
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

    /** Handler for activating the user invite form */
    this.onClickInvite = function(e){
      if (this.state.active_form === "invite"){
        console.log("Deactivating invite form");
        this.setState({active_form: ""});

      } else {
        console.log("Activating invite form");
        this.setState({active_form: "invite"});
      }
      e.stopPropagation();
      console.log("State: " + this.state.active_form);
    };
    this.onClickInvite = this.onClickInvite.bind(this);

    this.onSubmitInvite = function(e){
      e.stopPropagation();
      console.log("Submit invite");
      this.setState({active_form: ""});
    };
    this.onSubmitInvite = this.onSubmitInvite.bind(this);

    /** Handler for activating the post message form */
    this.onClickMessage = function(e){
      if (this.state.active_form === "message"){
        this.setState({active_form: ""});
      } else {
        this.setState({active_form: "message"});
      }
      e.stopPropagation();
    };
    this.onClickMessage = this.onClickMessage.bind(this);

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

    /** Renders form button */
    this.formBtnDisplay = function(name, hdlr, text){
      const active_form = this.state.active_form;
      const btn_class = active_form !== "" ?
        "btn btn-outline-secondary btn-sm" :
        "btn btn-secondary btn-sm"
      ;
      if (active_form === name || active_form === ""){
        return (
          <div className="col-1">
            <button
              className={btn_class}
              onClick={hdlr}
            >
              {active_form === name ? "Cancel" : text}
            </button>
          </div>
        );
      } else {
        return <div className="col-1"> </div>;
      }
    };
    this.formBtnDisplay = this.formBtnDisplay.bind(this);
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
    let channelTabDetails = null;
    let channelTabForm = null;
    if (expanded){
      /* Showing expanded details */
      const archiveBtn = (
        <div className="col-2 offset-8">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={this.state.archived ? this.onUnarchive : this.onArchive}
          >
            {this.state.archived ? "Unarchive" : "Archive"}
          </button>
        </div>
      );
      const inviteBtn = this.formBtnDisplay("invite", this.onClickInvite, "Invite");
      const msgBtn = this.formBtnDisplay("message", this.onClickMessage, "Message");

      function interceptForm(e){e.stopPropagation();}

      if (this.state.active_form === "invite"){
        channelTabForm = (
          <div className="channel-tab-form">
            <form onSubmit={this.onSubmitInvite} className="form-horizontal" onClick={interceptForm}>
              <div className="form-group row">
                <label className="col-sm-2 control-label">User Email:</label>
                <div className="col-sm-8">
                  <input name="invite-email" type="text" className="form-control"
                         onChange={this.onChangeChannelName}
                  />
                </div>
                <div className="form-group col-sm-2">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </form>
          </div>
        );
      }
      channelTabDetails = (
        <div className="row">
          {inviteBtn}
          {msgBtn}
          {archiveBtn}
        </div>
      );
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
        {channelTabForm}
      </div>
    );
  }
}
