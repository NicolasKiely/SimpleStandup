/**
 * Panel for channel chat history
 */
import React, {Component} from 'react';
import {backend_request, dateToISO} from "../utils";


class LogTab extends Component{
  constructor(props) {
    super(props);
    this.panel = props.panel;
    this.logData = props.data;
  }

  render(){
    return <div className="channel-log-tab-wrapper">
      {this.logData.date}: Log Tab
    </div>
  }
}


export default class ChannelPanel extends Component {
  constructor(props){
    super(props);
    const dtEnd = new Date();
    const dtStart = new Date();
    dtStart.setDate(dtEnd.getDate() - 7);

    this.state = {
      dtStart: dtStart,
      dtEnd: dtEnd,
      logs: [
        {date: 0}, {date: 1}, {date: 2}, {date: 3}, {date: 4}, {date: 5}, {date: dtEnd.toDateString()}
      ]
    };
    this.app = props.app;
    this.index = props.index;
    this.channelID = this.index.state.activeChannel;

    /* Fetches logs from backend */
    this.fetchLogs = function(){
      const header = {
        user_email: this.state.user_email,
        user_token: this.state.user_token
      };
      const isoStart = dateToISO(this.state.dtStart);
      const isoEnd = dateToISO(this.state.dtEnd);
      const url = `/api/1/channels/${this.channelID}/logs/${isoStart}/${isoEnd}`;
      backend_request(url, this.index.global_handler, "GET", undefined, header).then(
        (response) => {
          console.log(response.data.payload);
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
