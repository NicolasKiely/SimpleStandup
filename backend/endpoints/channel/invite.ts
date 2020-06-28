/**
 * Endpoint for inviting a user to a channel
 */
import * as utils from '../../utils'
import * as auth from "../../auth"
import axios from "axios";


function invite_user(http_request, http_results){
  const user_token = http_request.headers["user_token"];
  const user_email = http_request.headers["user_email"];
  const channel_id = http_request.params["channel_id"];
  const invite_email = http_request.body["invite_email"];

  console.log("Inviting " + invite_email + " to channel " + channel_id);

  auth.authenticate_user(user_email, user_token).then(
    () => {
      auth_success(http_results, user_email, channel_id, invite_email);
    },
    user => {
      auth.failed_auth_handler(http_results, user);
    }
  );
}


function auth_success(http_results, user_email, channel_id, invite_email){
  const header = {
    "X-USER-EMAIL": user_email,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };

  const data = {
    "invite_email": invite_email,
    "channel_id": channel_id
  };
  const url = utils.get_internal_url("/channel/invite");
  axios({url: url, data: data, headers: header, method: "POST"}).then(
    res => {
      utils.handle_internal_response(http_results, res);
    },
    err => {
      console.log(err.response.data);
      utils.handle_internal_backend_error(http_results, err);
    }
  );
}

export {invite_user}
