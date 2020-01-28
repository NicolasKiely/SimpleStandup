/**
 * Endpoint for user to create new channel
 */
import axios from "axios";

import * as utils from '../utils'
import * as auth from "../auth"


function create_channel(http_request, http_results){
  const user_token = http_request.body.user_token;
  const user_email = http_request.body.user_email;
  console.log("Attempting to create channel for " + user_email);

  auth.authenticate_user(user_email, undefined).then(
    user => {
      console.log("Created channel");
      http_results.status(500).json(
        {"payload": {}, "error": "NOT_IMPLEMENTED", "message": "Endpoint is not finished"}
      );
    },
    user => {
      if (user === undefined){
        console.log("No user to create channel for");
      } else {
        console.log("Failed to authenticate user");
      }

      http_results.status(500).json(
        {"payload": {}, "error": "NOT_IMPLEMENTED", "message": "Endpoint is not finished"}
      );
    }
  );
}


export {create_channel};