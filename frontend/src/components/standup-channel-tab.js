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
      user_email: props.user_email,
      expanded: false
    };

    /* Callback for tab being clicked */
    this.onClick = function(){
      this.setState({expanded: !this.state.expanded});
    };
    this.onClick = this.onClick.bind(this);

    /* Callback for archiving tab */
    this.onArchive = function(){
      return true;
    };
    this.onArchive = this.onArchive.bind(this);
  }

  render(){
    const isOwner = this.state.channel_owner === this.state.user_email;
    const expanded = this.state.expanded;
    const wrapperClass = expanded ?
      "channel-tab-wrapper channel-tab-wrapper-expanded" :
      "channel-tab-wrapper channel-tab-wrapper-collapsed"
    ;
    const channelOwnerSpan = isOwner ?
      null :
      <span className="channel-tab-owner"> - {this.state.channel_owner}</span>
    ;
    let channelTabDetails;
    if (expanded){
      /* Showing expanded details */
      const archiveBtn = (
        <div className="col-1 offset-10">
          <button className="btn btn-outline-secondary btn-sm">
            Archive
          </button>
        </div>
      );
      channelTabDetails = (
        <div className="row">
          <div className="col-sm-12">
            {archiveBtn}
          </div>
        </div>
      );
    } else {
      /* Tab is collapsed */
      channelTabDetails = null;
    }

    return (
      <div className={wrapperClass} onClick={this.onClick}>
        <div className="row">
          <div className="col-sm-12">
            <span className="channel-tab-title">Channel: {this.state.channel_name}</span>
            {channelOwnerSpan}
          </div>
        </div>
        {channelTabDetails}
      </div>
    );
  }
}
