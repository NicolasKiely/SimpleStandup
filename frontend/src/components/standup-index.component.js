/**
 * Top level index components
 */
import React, {Component} from 'react';
import ReactGA from 'react-ga';
import {backend_request} from "../utils";
import ChannelIndexTab from "./channel-tab/channel-tab";
import ChannelPanel from "./channel-panel/channel-panel";


class CreateChannelForm extends Component {
  constructor(props){
    super(props);
    this.index = props.index;
    this.globalHandler = props.globalHandler;

    this.state = {
      displayNewChannelForm: false,
      channelName: ""
    };

    /* Click handler for opening/closing form for new channel */
    this.onEditNewChannel = function(){
      this.setState(
        {displayNewChannelForm: !this.state.displayNewChannelForm}
      );
    };
    this.onEditNewChannel = this.onEditNewChannel.bind(this);

    /* Channel name field handler */
    this.onChangeChannelName = function(e){
      this.setState({channelName: e.target.value});
    };
    this.onChangeChannelName = this.onChangeChannelName.bind(this);

    /* Handler for submiting request to create new channel */
    this.onCreateNewChannel = function(e){
      e.preventDefault();
      console.log("Creating new channel...");
      const send_data = {
        user_email: this.index.state.user_email, user_token: this.index.state.user_token,
        channel_name: this.state.channelName
      };

      backend_request("/api/1/channels", this.global_handler, "PUT", send_data).then(
        () => {
          console.log("Created new channel!");
          this.index.setState({error_msg: ""});
          this.setState({displayNewChannelForm: false, channelName: ""});
          this.index.fetch_channels();
          ReactGA.event({category: "User", action: "Create Channel"});
        },
        err => {
          console.log("Failed to create channel");
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to create channel";
          this.index.displayError(error_msg);
        }
      )
    };
    this.onCreateNewChannel = this.onCreateNewChannel.bind(this);
  }

  render(){
    const displayNewChannelFormClass = this.state.displayNewChannelForm ?
      "channel-list-form" : "channel-list-form-hidden";
    const newChannelButtonText = this.state.displayNewChannelForm ?
      "Cancel" : "Create New Channel";
    const newChannelButtonClass = this.state.displayNewChannelForm ?
      "btn btn-block btn-outline-secondary" : "btn btn-block btn-secondary";

    return (
      <div className="channel-list-form-padded-container">
        <button
          type="button" className={newChannelButtonClass}
          onClick={this.onEditNewChannel}
        >
          {newChannelButtonText}
        </button>

        <div className={displayNewChannelFormClass}>
          <form onSubmit={this.onCreateNewChannel} className="form-horizontal">
            <div className="form-group row">
              <label className="col-sm-2 control-label">Channel Name:</label>
              <div className="col-sm-8">
                <input name="channel-name" type="text" className="form-control"
                       onChange={this.onChangeChannelName}
                />
              </div>

              <div className="form-group col-sm-2">
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}


export default class StandupIndex extends Component {
  constructor(props) {
    super(props);
    this.global_handler = props.global_handler;
    this.app = props.app;

    this.state = {
      user_email: props.user_email,
      user_token: props.user_token,
      error_msg: "",
      channels: [],
      filtering: {"subscribed": true, "my": false, "archive": false},
      activeChannel: undefined
    };

    /* Displays error to user */
    this.displayError = function(msg){
      this.setState({error_msg: msg});
    };
    this.displayError = this.displayError.bind(this);

    /* Fetch existing channels for user */
    this.fetch_channels = function(){
      const header = {
        user_email: this.state.user_email,
        user_token: this.state.user_token
      };
      backend_request("/api/1/channels", props.global_handler, "GET", undefined, header).then(
        (response) => {
          this.setState({"channels": response.data.payload});
        },
        err => {
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to fetch list of channels";
          this.displayError(error_msg);
        }
      );
    };
    this.fetch_channels = this.fetch_channels.bind(this);
    this.fetch_channels();
    this.app.setChannelUpdater(this.fetch_channels);

    /* Filter callbacks */
    this.onFilterSubscribed = function(){
      const filtering = {"subscribed": true, "my": false, "archive": false};
      const filteredChannels = this.state.channels.filter(
        channel => {return !channel["archive"];}
      );
      this.setState({filtering: filtering, filteredChannels: filteredChannels});
    };
    this.onFilterSubscribed = this.onFilterSubscribed.bind(this);

    this.onFilterMy = function(){
      const filtering = {"subscribed": false, "my": true, "archive": false};
      const filteredChannels = this.state.channels.filter(
        channel => {
          return !channel["archive"] && channel["owner"] === this.state.user_email;
        }
      );
      this.setState({filtering: filtering, filteredChannels: filteredChannels});
    };
    this.onFilterMy = this.onFilterMy.bind(this);

    this.onFilterArchive = function(){
      const filtering = {"subscribed": false, "my": false, "archive": true};
      this.setState({filtering: filtering});
    };
    this.onFilterArchive = this.onFilterArchive.bind(this);

    this.setActiveChannel = function(channel_id){
      this.setState({activeChannel: channel_id});
    };
    this.setActiveChannel = this.setActiveChannel.bind(this);
  }

  render() {
    const error_msg = this.state.error_msg;
    const isChannelActive = this.state.activeChannel !== undefined;

    const subscribedFilterDivClass = (
      "channel-list-filter-left channel-list-filter " + (
      this.state.filtering.subscribed ?
        "channel-list-filter-active" :
        "channel-list-filter-inactive"
      )
    );
    const myFilterDivClass = (
      "channel-list-filter-middle channel-list-filter " + (
        this.state.filtering.my ?
          "channel-list-filter-active" :
          "channel-list-filter-inactive"
      )
    );
    const archiveFilterDivClass = (
      "channel-list-filter-right channel-list-filter " + (
        this.state.filtering.archive ?
          "channel-list-filter-active" :
          "channel-list-filter-inactive"
      )
    );

    /* Top tabs to filter channels */
    const filtering_tabs = this.state.channels.length && !isChannelActive ?
      (
        <div className="channel-list-filter-wrapper">
          <div className="row no-gutters">
            <div className="col-4">
              <div className={subscribedFilterDivClass} onClick={this.onFilterSubscribed}>
                <span className="channel-list-filter-header">Subscribed</span>
              </div>
            </div>
            <div className="col-4">
              <div className={myFilterDivClass} onClick={this.onFilterMy}>
                <span className="channel-list-filter-header">My Channels</span>
              </div>
            </div>
            <div className="col-4">
              <div className={archiveFilterDivClass} onClick={this.onFilterArchive}>
                <span className="channel-list-filter-header">Archived</span>
              </div>
            </div>
          </div>
        </div>
      ) :
      undefined
    ;

    /* Show error alert if there is an error */
    let error_div = <div/>;
    if (error_msg){
      error_div =(
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              {error_msg}
            </div>
          </div>
        </div>
      );
    }

    /* Create list of channels */
    let channel_divs = [];
    for (const channel of this.state.channels){
      const channel_name = channel["channel_name"];
      const channel_owner = channel["owner"];
      const user_email = this.state["user_email"];
      const user_token = this.state["user_token"];
      const archived = channel["archived"];
      const channel_id = channel["channel_id"];
      let isActive = false;
      if (this.state.filtering.subscribed){
        if (archived){continue;}
      } else if (this.state.filtering.my){
        if (archived){continue;}
        if (channel_owner !== user_email){continue}
      } else {
        if (!archived){continue;}
      }
      if (this.state.activeChannel !== undefined){
        if (this.state.activeChannel !== channel_id){
          continue
        } else {
          isActive = true;
        }
      }
      channel_divs.push(
        <ChannelIndexTab key={channel_name+"-"+isActive} channel_name={channel_name}
                         channel_owner={channel_owner} user_email={user_email}
                         global_handler={this.global_handler} channel_id={channel_id}
                         user_token={user_token} update_list_callback={this.fetch_channels}
                         archived={archived} log_error={this.displayError}
                         setActiveChannel={this.setActiveChannel}
                         isActive={isActive}
        />
      );
    }
    const returnBtn = isChannelActive ?
      (
        <button className="btn btn-secondary btn-block"
                onClick={() => this.setActiveChannel()}
        >
          &larr; Go Back
        </button>
      ): undefined
    ;

    return (
      <div style={{marginTop: 10}}>
        <div className="channel-list-form-container">
          {filtering_tabs}
          <div className="channel-list-form-padded-container">
            {error_div}
          </div>

          {channel_divs}
          {isChannelActive ? undefined : <CreateChannelForm index={this}/>}
          {returnBtn}
        </div>

        {isChannelActive ? <ChannelPanel index={this}/> : undefined}
      </div>
    );
  }
}