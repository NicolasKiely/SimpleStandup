/**
 * Panel for channel chat history
 */
import React, {Component} from 'react';
import {Badge} from 'react-bootstrap';
import {backend_request, dateToISO} from "../utils";


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
    for (const m of this.logData.messages){
      userPills.push(
        <Badge variant="secondary" key={m.user.email} className="channel-log-tab-user-badge" title={m.user.email}>
          {m.user["first_name"]} {m.user["last_name"]}
        </Badge>
      );
    }
    return <div className={wrapperClass} onClick={this.onClick}>
      <span className="channel-log-tab-date">{this.logData.date}</span>
      {userPills}
    </div>
  }
}


export default class ChannelPanel extends Component {
  constructor(props){
    super(props);
    const dtEnd = new Date();
    const dtStart = new Date();
    const initDate = dtEnd.getDate();
    dtStart.setDate(initDate - 7);
    dtEnd.setDate(initDate + 1);

    this.state = {
      dtStart: dtStart,
      dtEnd: dtEnd,
      logs: []
    };
    this.app = props.app;
    this.index = props.index;
    this.channelID = this.index.state.activeChannel;

    /* Fetches logs from backend */
    this.fetchLogs = function(){
      const header = {
        user_email: this.index.state.user_email,
        user_token: this.index.state.user_token
      };
      const isoStart = dateToISO(this.state.dtStart);
      const isoEnd = dateToISO(this.state.dtEnd);
      const url = `/api/1/channels/${this.channelID}/logs/${isoStart}/${isoEnd}`;
      backend_request(url, this.index.global_handler, "GET", undefined, header).then(
        (response) => {
          this.setState({logs: response.data.payload.logs});
        },
        err => {
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to fetch list of daily logs";
          this.index.displayError(error_msg);
          console.log(error_msg);
        }
      );

    };
    this.fetchLogs = this.fetchLogs.bind(this);
    this.fetchLogs();
  }

  render(){
    let dateDivs = [];
    for (const log of this.state.logs){
      dateDivs.push(
        <LogTab key={log.date} panel={this} data={log}/>
      );
    }

    return (
      <div className="channel-panel-form-container">
        <div className="channel-panel-form-header">
          <span>Channel Logs</span>
        </div>
        {dateDivs}
      </div>
    );
  }
}
