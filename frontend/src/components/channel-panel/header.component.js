/**
 * Header for channel panel
 */
import React, {Component} from "react";
import {dateToISO} from "../../utils";
import {FormControl, InputGroup} from "react-bootstrap";


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


export default ChannelPanelHeader;
