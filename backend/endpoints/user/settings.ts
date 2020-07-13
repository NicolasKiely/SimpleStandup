/**
 * Endpoints for user settings
 */
import * as auth from "../../auth";
import * as utils from "../../utils";
import axios from "axios";


/**
 * Returns user's settings
 */
function getSettings(httpRequest, httpResults){
  const userToken = httpRequest.headers["user_token"];
  const userEmail = httpRequest.headers["user_email"];

  auth.authenticate_user(userEmail, userToken).then(
    () => {
      getSettingsAuthSuccess(httpResults, userEmail);
    },
    user => {
      auth.failed_auth_handler(httpResults, user);
    }
  );
}


function getSettingsAuthSuccess(httpResults, userEmail){
  const header = {
    "X-USER-EMAIL": userEmail,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const url = utils.get_internal_url("/auth/user/settings/get");
  axios({url: url, headers: header, method: "GET"}).then(
    res => {
      utils.handle_internal_response(httpResults, res);
    },
    err => {
      console.log(err.response.data);
      utils.handle_internal_backend_error(httpResults, err);
    }
  );
}


/**
 * Set name of user
 */
function setName(httpRequest, httpResults){
  const userToken = httpRequest.headers["user_token"];
  const userEmail = httpRequest.headers["user_email"];
  const firstName = httpRequest.body["first_name"];
  const lastName = httpRequest.body["last_name"];

  auth.authenticate_user(userEmail, userToken).then(
    () => {
      setNameAuthSuccess(httpResults, userEmail, firstName, lastName);
    },
    user => {
      auth.failed_auth_handler(httpResults, user);
    }
  );
}


function setNameAuthSuccess(httpResults, userEmail, firstName, lastName){
  const header = {
    "X-USER-EMAIL": userEmail,
    "X-BACKEND-SECRET": utils.BACKEND_SECRET
  };
  const data = {
    first_name: firstName,
    last_name: lastName
  };
  const url = utils.get_internal_url("/auth/user/settings/name");
  axios({url: url, headers: header, method: "POST", data: data}).then(
    res => {
      utils.handle_internal_response(httpResults, res);
    },
    err => {
      console.log(err.response.data);
      utils.handle_internal_backend_error(httpResults, err);
    }
  );
}


export {getSettings, setName};
