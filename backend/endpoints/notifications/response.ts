/**
 * Endpoint for handling user response to notification
 */
import * as auth from "../../auth";
import * as utils from "../../utils";
import axios from "axios";


function updateNotification(httpRequest, httpResults){
  const userToken = httpRequest.headers["user_token"];
  const userEmail = httpRequest.headers["user_email"];
  const noteID = httpRequest.params["note_id"];

  auth.authenticate_user(userEmail, userToken).then(
    () => {
      auth_success(httpResults, userEmail, noteID, httpRequest.body);
    },
    user => {
      auth.failed_auth_handler(httpResults, user);
    }
  );
}


function auth_success(httpResults, userEmail, noteID, data){
  const header = {
    "X-USER-EMAIL": userEmail,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const url = utils.get_internal_url("/notify/response");
  data["notification_id"] = noteID;
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

export {updateNotification}
