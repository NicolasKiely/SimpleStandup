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
    user => {
      auth_success(http_results, user_email, channel_id, invite_email);
    },
    user => {
      auth_failed(http_results, user);
    }
  );
}


function auth_success(http_results, user_email, channel_id, invite_email){
  const header = {
    "X-USER-EMAIL": user_email,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };

  const url = utils.get_internal_url("/channel/invite");
  http_results.status(500).json(
    {"error": "NOT_IMPLEMENTED", "message": "Feature Not implemented"}
    )
}


/**
 * Callback in the case that authentication failed
 * @param http_results results object
 * @param user User model
 */
function auth_failed(http_results, user){
  if (user === undefined){
    console.log("No user");
    http_results.status(401).json(
      {"payload": {}, "error": "INVALID_AUTH", "message": "Failed to authenticate user"}
    );

  } else if (auth.user_token_expired(user)){
    console.log("User token expired");
    http_results.status(401).json(
      {"payload": {}, "error": "TOKEN_EXPIRED", "message": "Please log in"}
    );

  } else {
    console.log("Failed to authenticate user");
    http_results.status(401).json(
      {"payload": {}, "error": "INVALID_AUTH", "message": "Failed to authenticate user"}
    );
  }
}

export {invite_user}
