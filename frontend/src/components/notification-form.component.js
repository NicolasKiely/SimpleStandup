import React, {Component} from "react";
import {Toast} from "react-bootstrap";


/** Notification form */
class ToastNotification extends Component {
  constructor(props) {
    super(props);
    this.app = props.app;
    this.notification = props.notification
  }

  render(){
    if (this.notification === undefined){
      return undefined;
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
        </Toast.Body>
      </Toast>
    );
  }
}

export default ToastNotification;
