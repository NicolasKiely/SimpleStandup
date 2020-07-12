/**
 * Settings editor
 */
import React, {Component} from 'react';
import {FormControl, InputGroup} from "react-bootstrap";
import {backend_request} from "../utils";


export default class StandupSettings extends Component{
  constructor(props) {
    super(props);
    this.app = props.app;

    const sendData = {
      user_email: this.app.state.user_email, user_token: this.app.state.user_token,
    };
    console.log(sendData);

    backend_request(
      "/api/1/settings", this.app.global_handler, "GET", undefined, sendData
    ).then(
      response => {
        console.log(response.data.payload);
      },
      () => {console.log("Failed to get user settings!")}
    );
  }

  render(){
    return (
      <div className="settings-form-container">
        <div className="settings-form-header">
          <span>Account Settings</span>
        </div>

        <br />
        <div className="container">
          <div className="row">
            <div className="col-sm-8 offset-sm-2">
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>First Name:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type="text"/>
              </InputGroup>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>Last Name:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type="text"/>
              </InputGroup>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}
