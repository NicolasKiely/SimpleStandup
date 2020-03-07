import React, {Component} from 'react';

/**
 * Channel tab for index
 */
export default class ChannelIndexTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel_name: props.channel_name
    };
  }

  render(){
    return <div>{this.state.channel_name}</div>;
  }
}
