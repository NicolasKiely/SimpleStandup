/**
 * Tab component for a day's channel panel messages
 */
import React, {Component} from "react";
import {Badge, ListGroup} from "react-bootstrap";


class LogTab extends Component{
  constructor(props) {
    super(props);
    this.panel = props.panel;
    this.logData = props.data;

    this.state = {
      expanded: false
    };

    /* Invert expanded state on click */
    this.onClick = function(){
      this.setState({expanded: !this.state.expanded});
    };
    this.onClick = this.onClick.bind(this);
  }

  render(){
    const wrapperClass = this.state.expanded ?
      "channel-log-tab-wrapper channel-log-tab-wrapper-expanded" :
      "channel-log-tab-wrapper channel-log-tab-wrapper-collapsed"
    ;
    const userPills = [];
    const userMessages = [];
    for (const m of this.logData.messages){
      const name = m.user["first_name"] +" "+ m.user["last_name"];
      const key = m.user.email;
      const badge = (
        <Badge variant="secondary" key={key} title={m.user.email}
               className="channel-log-tab-user-badge"
        >
          {name}
        </Badge>
      );
      if (this.state.expanded){
        userMessages.push(
          <ListGroup.Item key={key}>
            {badge}: {m.message}
          </ListGroup.Item>
        );
      } else {
        userPills.push(badge);
      }
    }
    return <div className={wrapperClass} onClick={this.onClick}>
      <span className="channel-log-tab-date">{this.logData.date}</span>
      {userPills}
      <ListGroup variant="flush">
        {userMessages}
      </ListGroup>
    </div>
  }
}

export default LogTab;
