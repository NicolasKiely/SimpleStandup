/**
 * Panel for channel chat history
 */
import React, {Component} from 'react';


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
    dtStart.setDate(dtEnd - 7);

    this.state = {
      dtStart: dtStart,
      dtEnd: dtEnd,
      logs: [
        {date: 0}, {date: 1}, {date: 2}, {date: 3}, {date: 4}, {date: 5}, {date: dtEnd.toDateString()}
      ]
    };
    this.app = props.app;
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
