import React, {Component} from 'react';

/**
 * Channel tab for index
 */
export default class ChannelIndexTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channel_name: props.channel_name,
      channel_owner: props.channel_owner,
      user_email: props.user_email
    };
  }

  render(){
    const is_owner = this.state.channel_owner === this.state.user_email;
    const channel_owner_span = (
      <span className="channel-tab-owner"> - {this.state.channel_owner}</span>
    );

    return (
      <div className="channel-tab-wrapper">
        <span className="channel-tab-title">Channel: {this.state.channel_name}</span>
        {is_owner ? "" :  channel_owner_span}
      </div>
    );
  }
}
