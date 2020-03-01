/**
 * Endpoint for user to create new channel
 */
import axios from "axios";

import * as utils from '../utils'
import * as auth from "../auth"


/**
 * Entry point to create channel
 */
function create_channel(http_request, http_results){
  const user_token = http_request.body.user_token;
  const user_email = http_request.body.user_email;
  console.log("Attempting to create channel for " + user_email);
  console.log("With token " + user_token);

  auth.authenticate_user(user_email, user_token).then(
    user => {
      console.log("Created channel");
      http_results.status(500).json(
        {"payload": {}, "error": "NOT_IMPLEMENTED", "message": "Endpoint is not finished"}
      );
    },
    user => {
      if (user === undefined){
        console.log("No user to create channel for");
        http_results.status(500).json(
          {"payload": {}, "error": "NOT_IMPLEMENTED", "message": "Endpoint is not finished"}
        );

      } else if (auth.user_token_expired(user)){
        console.log("User token expired");
        http_results.status(401).json(
          {"payload": {}, "error": "TOKEN_EXPIRED", "message": "Please log in"}
        );

      } else {
        console.log("Failed to authenticate user");
        http_results.status(500).json(
          {"payload": {}, "error": "NOT_IMPLEMENTED", "message": "Endpoint is not finished"}
        );
      }
    }
  );
}


export {create_channel};