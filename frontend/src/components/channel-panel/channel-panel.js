/**
 * Panel for channel chat history
 */
import React, {Component} from 'react';
import {backend_request, currentDateToISO, dateToISO} from "../../utils";
import LogTab from "./log-tab.component";
import ChannelPanelHeader from "./header.component";


export default class ChannelPanel extends Component {
  constructor(props){
    super(props);
    const dtEnd = new Date(currentDateToISO());
    const dtStart = new Date(currentDateToISO());
    const initDate = dtEnd.getDate();
    dtStart.setDate(initDate - 7);

    this.state = {
      dtStart: dtStart,
      dtEnd: dtEnd,
      logs: []
    };
    this.app = props.app;
    this.index = props.index;
    this.channelID = this.index.state.activeChannel;

    /* Fetches logs from backend */
    this.fetchLogs = function(newStart, newEnd){
      newStart = newStart === undefined ? this.state.dtStart : newStart;
      newEnd = newEnd === undefined ? this.state.dtEnd : newEnd;
      const header = {
        user_email: this.index.state.user_email,
        user_token: this.index.state.user_token
      };
      const isoStart = dateToISO(newStart);
      const isoEnd = dateToISO(newEnd);
      const url = `/api/1/channels/${this.channelID}/logs/${isoStart}/${isoEnd}`;
      backend_request(url, this.index.global_handler, "GET", undefined, header).then(
        (response) => {
          this.setState({logs: response.data.payload.logs, dtStart: newStart, dtEnd: newEnd});
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
          <ChannelPanelHeader panel={this} />
        </div>
        {dateDivs}
      </div>
    );
  }
}
