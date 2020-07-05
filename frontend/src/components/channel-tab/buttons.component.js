import {backend_request} from "../../utils";
import React, {Component} from "react";


/**
 * Stateful button for channel tab
 * Properties:
 *  - tab: Parent channel index tab object
 */
class ChannelTabButton extends Component {
  constructor(props){
    super(props);
    this.tab = props.tab;
  }
}


/**
 * Button to archive/unarchive channel
 */
class ArchiveButton extends ChannelTabButton {
  constructor(props){
    super(props);

    /* Callback for archiving/leaving channel */
    function onArchive(){
      const channelPath = "/api/1/channels/" + this.tab.channel_id;
      const header = {
        user_email: this.tab.state.user_email, user_token: this.tab.state.user_token
      };

      backend_request(
        channelPath, this.tab.global_handler, "DELETE", undefined, header
      ).then(
        () => {
          this.tab.update_list_callback();
        },
        err => {
          console.log("Failed to archive channel " + this.tab.channel_id);
          const errorMsg = err.response && err.response.data ?
            err.response.data.message: "Failed to archive channel";
          this.tab.displayError(errorMsg);
        }
      );
    }

    /* Callback for unarchiving channel */
    function onUnarchive(){
      const sendData = {
        user_email: this.tab.state.user_email, user_token: this.tab.state.user_token,
        channel_name: this.tab.state.channel_name
      };
      backend_request(
        "/api/1/channels", this.tab.global_handler, "PUT", sendData
      ).then(
        () => {
          this.tab.setState({error_msg: "", display_new_channel_form: false});
          this.tab.update_list_callback();
        },
        err => {
          console.log("Failed to unarchive channel");
          const error_msg = err.response && err.response.data ?
            err.response.data.message: "Failed to unarchive channel";
          this.tab.displayError(error_msg);
        }
      );
    }

    /* Pick callback based on context */
    this.onClick = this.tab.state.archived ? onUnarchive : onArchive;
    this.onClick = this.onClick.bind(this);
  }

  render(){
    let text;
    if (this.tab.isOwner){
      text = this.tab.state.archived ? "Unarchive" : "Archive";
    } else {
      text = "Leave";
    }
    return (
      <div className="col-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={this.onClick}
        >
          {text}
        </button>
      </div>
    );
  }
}

export {ArchiveButton};
