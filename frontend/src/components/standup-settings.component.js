/**
 * Settings editor
 */
import React, {Component} from 'react';
import {Button, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {backend_request} from "../utils";


export default class StandupSettings extends Component{
  constructor(props) {
    super(props);
    this.app = props.app;

    this.state = {
      firstName: "",
      lastName: ""
    };

    const sendData = {
      user_email: this.app.state.user_email, user_token: this.app.state.user_token,
    };
    console.log(sendData);

    backend_request(
      "/api/1/settings", this.app.global_handler, "GET", undefined, sendData
    ).then(
      response => {
        const userSettings = response.data.payload["user"];
        this.setState({
          firstName: userSettings["first_name"],
          lastName: userSettings["last_name"]
        });
      },
      () => {console.log("Failed to get user settings!")}
    );

    this.changeFirstName = function(e){
      this.setState({firstName: e.target.value});
    };
    this.changeLastName = function(e){
      this.setState({lastName: e.target.value})
    };
    this.changeFirstName = this.changeFirstName.bind(this);
    this.changeLastName = this.changeLastName.bind(this);

    this.saveName = function(e){
      e.stopPropagation();
      e.preventDefault();

      const header = {
        user_email: this.app.state.user_email,
        user_token: this.app.state.user_token
      };
      const data = {
        first_name: this.state.firstName,
        last_name: this.state.lastName
      };
      const url = "/api/1/settings/name";
      backend_request(url, this.app.global_handler, "POST", data, header).then(
        () => {
          console.log("Saved name");
        },
        () => {console.log("Failed to save user name")}
      );
    };
    this.saveName = this.saveName.bind(this);
  }

  render(){
    return (
      <div className="settings-form-container">
        <div className="settings-form-header">
          <span>Account Settings</span>
        </div>

        <br />
        <div className="container">
          <Row>
            <div className="col-sm-8 offset-sm-2">
              <Form onSubmit={this.saveName}>
                Email Address: <b>{this.app.state.user_email}</b>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>First Name:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl type="text" defaultValue={this.state.firstName}
                               onChange={this.changeFirstName}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Last Name:</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl type="text" defaultValue={this.state.lastName}
                               onChange={this.changeLastName}
                  />
                </InputGroup>
                <Button type="submit" variant="primary">Save</Button>
              </Form>
            </div>
          </Row>
        </div>
        <br />
      </div>
    );
  }
}
