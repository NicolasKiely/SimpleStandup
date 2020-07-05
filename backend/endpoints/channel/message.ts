/**
 * Endpoint for users to post a message to a channel
 */
import * as auth from "../../auth";
import * as utils from "../../utils";
import axios from "axios";


function messageChannel(httpRequest, httpResults){
  const userToken = httpRequest.headers["user_token"];
  const userEmail = httpRequest.headers["user_email"];
  const channelID = httpRequest.params["channel_id"];
  const message = httpRequest.body["message"];
  const posted = httpRequest.body["dt_posted"];

  auth.authenticate_user(userEmail, userToken).then(
    () => {
      auth_success(httpResults, userEmail, channelID, message, posted);
    },
    user => {
      auth.failed_auth_handler(httpResults, user);
    }
  );
}


function auth_success(httpResults, userEmail, channelID, message, posted){
  const header = {
    "X-USER-EMAIL": userEmail,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const url = utils.get_internal_url("/channel/message");
  const data = {
    "channel_id": channelID,
    "message": message,
    "dt_posted": posted
  };
  axios({url: url, headers: header, method: "POST", data}).then(
    res => {
      utils.handle_internal_response(httpResults, res);
    },
    err => {
      console.log(err.response.data);
      utils.handle_internal_backend_error(httpResults, err);
    }
  );
}


export {messageChannel}
