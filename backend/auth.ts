import * as model_schema from "./schema";


/**
 * Promise to authenticate a user
 * @param user_email Email address of account to authenticate
 * @param user_token User provided token to authenticate against
 */
function authenticate_user(user_email, user_token){
  return new Promise(
    (resolve, reject) => {
      model_schema.UserProfile.find(
        {email: user_email}
      ).then(
        models =>{
          authenticate_user_search(models, user_token, resolve, reject);
        }
      )
    }
  );
}


/**
 * Handles search query for user for user token authentication
 * @param models Results from search query
 * @param user_token User provided authentication token to validate
 * @param resolve Promise's resolve function, with user model passed
 * @param reject Promise's error handler, with user model passed if user found, and if token is valid
 */
function authenticate_user_search(models, user_token, resolve, reject){
  if (models.length === 0){
    /* User not found */
    reject(undefined);

  } else {
    /* User found, check token */
    const user_model = models[0];
    if (user_token_expired(user_model)){
      reject(user_model, false);

    } else if (user_model.token === user_token){
      resolve(user_model);

    } else {
      reject(user_model, true);
    }
  }
}


/**
 * Returns true iff user's token is not valid
 * @param user_model
 */
function user_token_expired(user_model){
  if (user_model.token === undefined){
    return true;
  }
  return false;
}

export {authenticate_user, user_token_expired};
