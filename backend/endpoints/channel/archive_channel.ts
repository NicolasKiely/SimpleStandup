/**
 * Endpoint for delisting a channel for a user
 */
import * as utils from '../../utils'
import * as auth from "../../auth"
import axios from "axios";


/**
 * Entry point to archive a channel for a user
 */
function archive_channel(http_request, http_results) {
  const user_token = http_request.headers["user_token"];
  const user_email = http_request.headers["user_email"];
  const channel_id = http_request.params["channel_id"];
  console.log("Archiving channel " + channel_id);
  auth.authenticate_user(user_email, user_token).then(
    user => {
      auth_success(http_results, user_email, channel_id);
    },
    user => {
      auth_failed(http_results, user);
    }
  );
}


function auth_success(http_results, user_email, channel_id){
  const header = {
    "X-USER-EMAIL": user_email,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const data = {
    "channel_id": channel_id
  };
  const url = utils.get_internal_url("/channel/archive");
  axios({url: url, data: data, headers: header, method: "POST"}).then(
    res => {
      handle_internal_response(http_results, res);
    },
    err => {
      console.log(err.response.data);
      utils.handle_internal_backend_error(http_results, err);}
  );
}


function handle_internal_response(http_results, int_results){
  let ext_status = int_results.data.status || 500;

  http_results.status(ext_status).json(
    {
      'payload': int_results.data.payload, 'error': int_results.data.error,
      'message': int_results.data.message
    }
  );
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

export {archive_channel};
