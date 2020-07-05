/**
 * Endpoint for listing unread notifications
 */
import * as auth from "../../auth";
import * as utils from "../../utils";
import axios from "axios";


function listUnread(http_request, http_results){
  const user_token = http_request.headers["user_token"];
  const user_email = http_request.headers["user_email"];

  auth.authenticate_user(user_email, user_token).then(
    () => {
      auth_success(http_results, user_email);
    },
    user => {
      auth.failed_auth_handler(http_results, user);
    }
  );
}


function auth_success(http_results, user_email){
  const header = {
    "X-USER-EMAIL": user_email,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const url = utils.get_internal_url("/notify/list/unread");
  axios({url: url, headers: header, method: "GET"}).then(
    res => {
      utils.handle_internal_response(http_results, res);
    },
    err => {
      utils.handle_internal_backend_error(http_results, err);
    }
  );
}


export {listUnread}
