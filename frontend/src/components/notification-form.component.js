import React, {Component} from "react";
import {Toast} from "react-bootstrap";
import {backend_request} from "../utils";


/** Notification form */
class ToastNotification extends Component {
  constructor(props) {
    super(props);
    this.app = props.app;
    this.notification = props.notification;

    /* Helper method to create button links */
    this.buttonify = function(text, dataFunc){
      const onClick = this.noteResponseClosure(dataFunc);
      return (
        <button role="link" type="link" className="btn btn-link" onClick={onClick}>
          {text}
        </button>
      );
    };
    this.buttonify = this.buttonify.bind(this);

    /* Generic handler closure for responding to notification */
    this.noteResponseClosure = function(dataFunc){
      let response = function(){
        const pk = this.notification["id"];
        this.app.activateNotification(undefined);

        const header = {
          user_email: this.app.state.user_email,
          user_token: this.app.state.user_token
        };
        const data = dataFunc();
        const url = "/api/1/notifications/" + pk;
        backend_request(url, this.app.global_handler, "PATCH", data, header).then(
          () => {console.log("Notification dismissed")},
          err => {console.log(err)}
        );
      };
      response = response.bind(this);
      return response;
    };
    this.noteResponseClosure = this.noteResponseClosure.bind(this);
  }

  render(){
    if (this.notification === undefined){
      return undefined;
    }
    let inviteForm;
    if (this.notification["role"].toLowerCase() === "invite"){
      // Setup invite form
      inviteForm = (
        <div className="float-right">
          {this.buttonify("Accept", () => {return {dismissed: true, invite: "accepted"}})} |
          {this.buttonify("Decline", () => {return {dismissed: true, invite: "declined"}})}
        </div>
      );
    } else {
      inviteForm = (
        <div className="float-right">
          {this.buttonify("Dismiss", () => {return {dismissed: true}})}
        </div>
      )
    }
    return (
      <Toast onClose={() => this.app.activateNotification(undefined)}>
        <Toast.Header>
          <strong className="mr-auto">
            {this.notification["title"]}
          </strong>
        </Toast.Header>
        <Toast.Body>
          {this.notification["message"]}
          {inviteForm}
        </Toast.Body>
      </Toast>
    );
  }
}

export default ToastNotification;
