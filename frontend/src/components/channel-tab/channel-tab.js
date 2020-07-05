import React, {Component} from 'react';
import {ArchiveButton} from "./buttons.component";
import {InviteForm, MessageForm} from "./forms.component";


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
    this.setActiveChannel = props.setActiveChannel;

    this.state = {
      archived: props.archived,
      channel_name: props.channel_name,
      channel_owner: props.channel_owner,
      user_email: props.user_email,
      user_token: props.user_token,
      expanded: props.isActive,
      active_form: "",
      isActive: props.isActive
    };

    /* Callback for tab being clicked */
    this.onClick = function(){
      this.setState({expanded: !this.state.expanded, active_form: ""});
    };
    this.onClick = this.onClick.bind(this);

    /** Handler for activating the user invite form */
    this.onClickInvite = function(e){
      if (this.state.active_form === "invite"){
        this.setState({active_form: ""});
      } else {
        this.setState({active_form: "invite"});
      }
      e.stopPropagation();
      console.log("State: " + this.state.active_form);
    };
    this.onClickInvite = this.onClickInvite.bind(this);

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

    this.onClickHistory = function(e){
      this.setActiveChannel(this.channel_id);
      e.stopPropagation();
    };
    this.onClickHistory = this.onClickHistory.bind(this);

    /** Renders form button */
    this.formBtnDisplay = function(name, hdlr, text){
      const active_form = this.state.active_form;
      const btn_class = active_form !== "" ?
        "btn btn-outline-secondary btn-sm" :
        "btn btn-secondary btn-sm"
      ;
      if (active_form === name || active_form === ""){
        return (
            <button
              className={btn_class + " ml-2"}
              onClick={hdlr}
            >
              {active_form === name ? "Cancel" : text}
            </button>
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
      const inviteBtn = this.isOwner ?
        this.formBtnDisplay("invite", this.onClickInvite, "Invite") :
        undefined
      ;
      const msgBtn = this.formBtnDisplay("message", this.onClickMessage, "Message");
      const histBtn = this.state.isActive ?
        undefined :
        this.formBtnDisplay("history", this.onClickHistory, "History")
      ;

      if (this.state.active_form === "invite"){
        channelTabForm = <InviteForm tab={this} />;
      } else if (this.state.active_form === "message") {
        channelTabForm = <MessageForm tab={this} />;
      }
      channelTabDetails = (
        <div className="row">
          <div className="col-8 mr-auto">
            {histBtn}
            {inviteBtn}
            {msgBtn}
          </div>
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
