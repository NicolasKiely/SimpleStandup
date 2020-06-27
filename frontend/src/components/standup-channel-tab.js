import React, {Component} from 'react';
import {backend_request} from "../utils";


/**
 * Stateful button for channel tab
 * Properties:
 *  - tab: Parent channel index tab object
 */
class ChannelTabButton extends Component {
  constructor(props){
    super(props);
    this.tab = props.tab;
  }
}


/**
 * Button to archive/unarchive channel
 */
class ArchiveButton extends ChannelTabButton {
  constructor(props){
    super(props);

    /* Callback for archiving/leaving channel */
    function onArchive(){
      const channelPath = "/api/1/channels/" + this.tab.channel_id;
      const header = {
        user_email: this.tab.state.user_email, user_token: this.tab.state.user_token
      };

      backend_request(
        channelPath, this.tab.global_handler, "DELETE", undefined, header
      ).then(
        () => {
          this.tab.update_list_callback();
        },
        err => {
          console.log("Failed to archive channel " + this.tab.channel_id);
          const errorMsg = err.response && err.response.data ?
            err.response.data.message: "Failed to archive channel";
          this.tab.displayError(errorMsg);
        }
      );
    }

    /* Callback for unarchiving channel */
    function onUnarchive(){
      const sendData = {
        user_email: this.tab.state.user_email, user_token: this.tab.state.user_token,
        channel_name: this.tab.state.channel_name
      };
      backend_request(
        "/api/1/channels", this.tab.global_handler, "PUT", sendData
      ).then(
        () => {
          this.tab.setState({error_msg: "", display_new_channel_form: false});
          this.tab.update_list_callback();
        },
        err => {
          console.log("Failed to unarchive channel");
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to unarchive channel";
          this.tab.displayError(error_msg);
        }
      );
    }

    /* Pick callback based on context */
    this.onClick = this.tab.state.archived ? onUnarchive : onArchive;
    this.onClick = this.onClick.bind(this);
  }

  render(){
    let text;
    if (this.tab.isOwner){
      text = this.tab.state.archived ? "Unarchive" : "Archive";
    } else {
      text = "Leave";
    }
    return (
      <div className="col-2 offset-7">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={this.onClick}
        >
          {text}
        </button>
      </div>
    );
  }
}


/**
 * Channel tab for index
 */
export default class ChannelIndexTab extends Component {
  constructor(props) {
    super(props);

    this.channel_id = props.channel_id;
    this.update_list_callback = props.update_list_callback;
    this.displayError = props.log_error;
    this.global_handler = props.global_handler;
    this.isOwner = (
      props.channel_owner.toLowerCase() === props.user_email.toLowerCase()
    );

    this.state = {
      archived: props.archived,
      channel_name: props.channel_name,
      channel_owner: props.channel_owner,
      user_email: props.user_email,
      user_token: props.user_token,
      expanded: false,
      active_form: "",
      invite_form: {email: ""},
    };

    /* Callback for tab being clicked */
    this.onClick = function(){
      this.setState({expanded: !this.state.expanded, active_form: ""});
    };
    this.onClick = this.onClick.bind(this);

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

    this.onChangeInviteEmail = function(e){
      this.setState({invite_form: {email: e.target.value}});
    };
    this.onChangeInviteEmail = this.onChangeInviteEmail.bind(this);

    this.onSubmitInvite = function(e){
      e.stopPropagation();
      e.preventDefault();
      const invite_email = this.state.invite_form.email;
      console.log("Submit invite to " + invite_email);
      const header = {
        user_email: this.state.user_email,
        user_token: this.state.user_token
      };
      const data = {
        invite_email: invite_email
      };
      const url = "/api/1/channels/"+this.channel_id+"/invites";
      backend_request(
        url, props.global_handler, "PUT", data, header
      ).then(
        () => {
          console.log("Successfully sent invite");
          this.displayError();
          this.setState({active_form: "", invite_form: {email: ""}});
        },
        err => {
          console.log("Failed to send invite to user");
          const def = "Failed to invite user " + invite_email;
          const error_msg = err.response && err.response.data ?
            err.response.data.message || def : def;
          this.displayError(error_msg);
        }
      );
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
    const expanded = this.state.expanded;
    const wrapperClass = expanded ?
      "channel-tab-wrapper channel-tab-wrapper-expanded" :
      "channel-tab-wrapper channel-tab-wrapper-collapsed"
    ;
    const channelOwnerSpan = this.isOwner ?
      null :
      <span className="channel-tab-owner"> - {this.state.channel_owner}</span>
    ;
    let channelTabDetails = null;
    let channelTabForm = null;
    if (expanded){
      /* Showing expanded details */
      const archiveBtn = <ArchiveButton tab={this} />;
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
                         onChange={this.onChangeInviteEmail}
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
