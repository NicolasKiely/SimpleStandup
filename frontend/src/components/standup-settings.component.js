/**
 * Settings editor
 */
import React, {Component} from 'react';
import {FormControl, InputGroup} from "react-bootstrap";


export default class StandupSettings extends Component{
  constructor(props) {
    super(props);
    this.app = props.app;
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
