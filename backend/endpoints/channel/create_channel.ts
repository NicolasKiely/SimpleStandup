/**
 * Endpoint for user to create new channel
 */
import axios from "axios";

import * as utils from '../../utils'
import * as auth from "../../auth"


/**
 * Entry point to create channel
 */
function create_channel(http_request, http_results){
  const user_token = http_request.body.user_token;
  const user_email = http_request.body.user_email;
  const channel_name = http_request.body.channel_name;

  auth.authenticate_user(user_email, user_token).then(
    user => {
      auth_success(http_results, user_email, channel_name);
    },
    user => {
      auth_failed(http_results, user);
    }
  );
}


/**
 * Callback in the case that use authenticated
 * @param http_results Results object
 * @param user_email User id
 * @param channel_name Name of channel to create
 */
function auth_success(http_results, user_email, channel_name){
  const request_data = {
    user_email: user_email,
    channel_name: channel_name,
    BACKEND_SECRET: utils.BACKEND_SECRET
  };
  axios.post(utils.get_internal_url("/channel/create"), request_data).then(
    res => {
      channel_created(http_results, res);
    },
    err => {
      console.log(err.response.data);
      utils.handle_internal_backend_error(http_results, err);}
  );
}


/**
 * Callback in case channel has successfully been created
 * @param http_results
 * @param int_results
 */
function channel_created(http_results, int_results){
  let ext_status = int_results.data.status || 500;
  console.log("Created channel");

  http_results.status(ext_status).json(
    {
      'payload': int_results.data.payload, 'error': int_results.data.error,
      'message': int_results.data.message
    }
  );
}


/**
 * Callback in the case that authentication failed for creating channel
 * @param http_results results object
 * @param user User model
 */
function auth_failed(http_results, user){
  if (user === undefined){
    console.log("No user to create channel for");
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


export {create_channel};