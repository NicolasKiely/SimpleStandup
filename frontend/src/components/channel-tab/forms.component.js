import React, {Component} from "react";
import {backend_request} from "../../utils";


/* Block bubbling up clicks on form */
function interceptForm(e){e.stopPropagation();}


/** Tab form for inviting user */
class InviteForm extends Component {
  constructor(props) {
    super(props);
    this.tab = props.tab;
    this.state = {invite_form: {email: ""}};

    /** Form handler for submitting invite */
    this.onSubmitInvite = function(e){
      e.stopPropagation();
      e.preventDefault();
      const invite_email = this.state.invite_form.email;
      const header = {
        user_email: this.tab.state.user_email,
        user_token: this.tab.state.user_token
      };
      const data = {
        invite_email: invite_email
      };
      const url = "/api/1/channels/"+this.tab.channel_id+"/invites";
      backend_request(
        url, this.tab.global_handler, "PUT", data, header
      ).then(
        () => {
          this.tab.displayError();
          this.setState({invite_form: {email: ""}});
          this.tab.setState({active_form: ""});
        },
        err => {
          console.log("Failed to send invite to user");
          const def = "Failed to invite user " + invite_email;
          const error_msg = err.response && err.response.data ?
            err.response.data.message || def : def;
          this.tab.displayError(error_msg);
        }
      );
    };
    this.onSubmitInvite = this.onSubmitInvite.bind(this);

    /** Handler for invitee email input field */
    this.onChangeInviteEmail = function(e){
      this.setState({invite_form: {email: e.target.value}});
    };
    this.onChangeInviteEmail = this.onChangeInviteEmail.bind(this);
  }

  render(){
    return (
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
}


/**
 * Tab form for messaing channel
 */
class MessageForm extends Component{
  constructor(props) {
    super(props);
    this.tab = props.tab;
    this.today = new Date().toISOString().substr(0, 10);

    this.state = {
      date: this.today,
      message: ""
    };

    this.onChangeDate = function(e){
      this.setState({date: e.target.value});
    };
    this.onChangeDate = this.onChangeDate.bind(this);

    this.onChangeMessage = function(e){
      this.setState({message: e.target.value});
    };
    this.onChangeMessage = this.onChangeMessage.bind(this);

    this.onSubmit = function(e){
      e.stopPropagation();
      e.preventDefault();

      console.log("Posting message: " + this.state.date + " - " + this.state.message);
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  render(){
    return (
      <div className="channel-tab-form">
        <form onSubmit={this.onSubmit} className="form-horizontal" onClick={interceptForm}>
          <div className="form-group row">
            <label className="col-sm-2 control-label">Date:</label>
            <div className="col-sm-4">
              <input name="message-date" type="date" className="form-control"
                     defaultValue={this.today} onChange={this.onChangeDate}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 control-label">Message:</label>
            <div className="col-sm-8">
              <textarea name="message-text" className="form-control" cols="3"
                        onChange={this.onChangeMessage}
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
}


export {InviteForm, MessageForm};
