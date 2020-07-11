import * as auth from "../../auth";
import * as utils from "../../utils";
import axios from "axios";


function listLogs(httpRequest, httpResults){
  const userToken = httpRequest.headers["user_token"];
  const userEmail = httpRequest.headers["user_email"];
  const channelID = httpRequest.params["channel_id"];
  const dtStart = httpRequest.params["dt_start"];
  const dtEnd = httpRequest.params["dt_end"];

  auth.authenticate_user(userEmail, userToken).then(
    () => {
      auth_success(httpResults, userEmail, channelID, dtStart, dtEnd);
    },
    user => {
      auth.failed_auth_handler(httpResults, user);
    }
  );
}


function auth_success(httpResults, userEmail, channelID, dtStart, dtEnd) {
  const header = {
    "X-USER-EMAIL": userEmail,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const url = utils.get_internal_url("/channel/logs/list");
  const data = {
    "channel_id": channelID,
    "dt_start": dtStart,
    "dt_end": dtEnd
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


export {listLogs};
