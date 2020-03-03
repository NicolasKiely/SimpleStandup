/**
 * Endpoint for fetching list of channels
 */
import * as utils from '../../utils'
import * as auth from "../../auth"
import axios from "axios";


/**
 * Entry points to return list of channels for a user
 */
function list_channels(http_request, http_results){
  const user_token = http_request.body.user_token;
  const user_email = http_request.body.user_email;
  auth.authenticate_user(user_email, user_token).then(
    user => {
      auth_success(http_results, user_email);
    },
    user => {
      auth_failed(http_results, user);
    }
  );
}


function auth_success(http_results, user_email){
  const request_data = {
    user_email: user_email,
    BACKEND_SECRET: utils.BACKEND_SECRET
  };
  axios.post(utils.get_internal_url("/channel/list"), request_data).then(
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

export {list_channels};
