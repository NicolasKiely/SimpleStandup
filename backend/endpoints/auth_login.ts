import axios from "axios";
import * as uuid from "uuid";

import * as model_schema from "../schema";
import * as utils from '../utils'


/**
 * Endpoint to login user.
 * Defers authentication logic to internal backend.
 * @param http_request: Client http request
 * @param http_results: Client http response
 */
function auth_login(http_request, http_results) {
  const int_request_data = {
    BACKEND_SECRET: utils.BACKEND_SECRET,
    user_email: http_request.body.login_email,
    user_pass: http_request.body.login_pass
  };

  axios.post(
    'http://localhost:8040/auth/user/login', int_request_data
  ).then(
    res => {internal_login_callback(http_results, res)},
    err => {
      let ext_status = err.response.data.status || 500;
      http_results.status(ext_status).json(
        {'payload': {}, 'error': err.response.data.error, 'message': err.response.data.message}
      );
    }
  );
}

/**
 * Handles results from internal api
 * @param http_results: Client http response
 * @param int_login_results: Http response from internal backend
 */
function internal_login_callback(http_results, int_login_results) {
  let ext_status = int_login_results.data.status || 500;
  let ext_payload = {};

  function final_callback(user) {
    http_results.status(ext_status).json(
      {
        'payload': ext_payload, 'error': int_login_results.data.error,
        'message': int_login_results.data.message
      }
    );
  }

  if (int_login_results.data.status == 200){
    /* Log user in */
    const user_email = int_login_results.data.payload.email;
    ext_payload['email'] = user_email;
    ext_payload['token'] = uuid.v4();

    model_schema.UserProfile.find(
      {email: user_email},
    ).then(
      models => {
        search_for_user(models, user_email, final_callback);
      }
    );
  }
}


/**
 * Handles search query for user
 * @param models List of users returned from query, either 0 or 1
 * @param user_email Email address of user
 */
function search_for_user(models, user_email: String, callback){
  console.log("Query Results: " + models);
  if (models.length === 0){
    let new_model = model_schema.UserProfile({
      email: user_email
    });
    new_model.save().then(
      new_user => {
        handle_user(new_user, callback);
      }
    );

  } else {
    handle_user(models[0], callback);
  }
}


function handle_user(user, callback){
  console.log('Processing account ' + user.email);
  callback(user);
}


export {auth_login};
