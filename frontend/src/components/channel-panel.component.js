/**
 * Panel for channel chat history
 */
import React, {Component} from 'react';
import {Badge, ListGroup, InputGroup, FormControl} from 'react-bootstrap';
import {backend_request, currentDateToISO, dateToISO} from "../utils";


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


class ChannelPanelHeader extends Component {
  constructor(props) {
    super(props);
    this.panel = props.panel;

    this.changeStart = function(e){
      const newStart = new Date(e.target.value);
      let newEnd = this.panel.state.dtEnd;
      const dtDiff = (newEnd - newStart) / (1000*60*60*24);
      if (dtDiff > 31){
        newEnd = new Date(dateToISO(newStart));
        newEnd.setDate(newStart.getDate() + 31);
      } else if (dtDiff < 0){
        newEnd = new Date(dateToISO(newStart));
      }

      this.panel.fetchLogs(newStart, newEnd);
    };
    this.changeStart = this.changeStart.bind(this);

    this.changeEnd = function(e){
      let newStart = this.panel.state.dtStart;
      const newEnd = new Date(e.target.value);
      const dtDiff = (newEnd - newStart) / (1000*60*60*24);
      if (dtDiff > 31){
        newStart = new Date(dateToISO(newEnd));
        newStart.setDate(newStart.getDate() - 31);
      } else if (dtDiff < 0){
        newStart = new Date(dateToISO(newEnd));
      }

      this.panel.fetchLogs(newStart, newEnd);
    };
    this.changeEnd = this.changeEnd.bind(this);
  }

  render(){
    const dtStart = dateToISO(this.panel.state.dtStart);
    const dtEnd = dateToISO(this.panel.state.dtEnd);
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-8 col-lg-6">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Date Range:</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl type="date" value={dtStart} onChange={this.changeStart}/>
              <FormControl type="date" value={dtEnd} onChange={this.changeEnd}/>
            </InputGroup>
          </div>
        </div>
      </div>
    );
  }
}


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
