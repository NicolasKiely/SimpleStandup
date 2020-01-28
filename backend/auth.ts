import * as model_schema from "./schema";


/**
 * Promise to authenticate a user
 * @param user_email Email address of account to authenticate
 * @param user_token User provided token to authenticate against
 */
function authenticate_user(user_email, user_token){
  return new Promise(
    (resolve, reject) => {
      console.log("Searching for user " + user_email);
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
 * @param reject Promise's error handler, with user model passed if user found
 */
function authenticate_user_search(models, user_token, resolve, reject){
  if (models.length === 0){
    /* User not found */
    console.log("User not found");
    reject(undefined);

  } else {
    /* User found, check token */
    const user_model = models[0];
    console.log("Found user " + user_model);
    if (user_model.token === user_token){
      console.log("User authenticated");
      resolve(user_model)

    } else {
      console.log("Failed to authenticate user");
      reject(user_model);
    }
  }
}

export {authenticate_user};
