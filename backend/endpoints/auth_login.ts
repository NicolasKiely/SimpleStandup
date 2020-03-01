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
    res => {internal_login_callback(http_results, res);},
    err => {utils.handle_internal_backend_error(http_results, err);}
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
    const new_token = uuid.v4();
    ext_payload['email'] = user_email;
    ext_payload['token'] = new_token;

    model_schema.UserProfile.find(
      {email: user_email},
    ).then(
      models => {
        search_for_user(models, user_email, new_token, final_callback);
      }
    );
  } else {
    /* Invalid login */
    final_callback(undefined);
  }
}


/**
 * Handles search query for user
 * @param models List of users returned from query, either 0 or 1
 * @param user_email Email address of user
 * @param new_token New token to save for user
 * @param callback Handler for returned user model
 */
function search_for_user(models, user_email: String, new_token: String, callback){
  let model;
  if (models.length === 0){
    model = model_schema.UserProfile({
      email: user_email, token: new_token
    });
  } else {
    model = models[0];
    model.token = new_token;
  }
  model.save().then(user => {handle_user(user, callback)});
}


function handle_user(user, callback){
  callback(user);
}


export {auth_login};
