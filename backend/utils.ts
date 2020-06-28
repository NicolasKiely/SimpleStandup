/** API Secret for internal backend */
const BACKEND_SECRET = process.env['BACKEND_SECRET'] || '';

/** Internal backend domain */
const INTERNAL_BACKEND_DOMAIN = process.env["INTERNAL_BACKEND_DOMAIN"] || "http://localhost:8040";
console.log("Using internal backend: " + INTERNAL_BACKEND_DOMAIN);


/**
 * Returns url of internal backend's endpoint
 * @param path Path of endpoint
 */
function get_internal_url(path){
  return INTERNAL_BACKEND_DOMAIN + path;
}


/** Generic handler for internal backend error response */
function handle_internal_backend_error(http_results, err){
  let ext_status, message, error_message;
  if (err.response === undefined){
    console.error("Unexpected connection error with internal backend");
    ext_status = 500;
    message = "Internal error";
    error_message = "internal_error";
  } else {
    ext_status = err.response.data.status || 500;
    message = err.response.data.message;
    error_message = err.response.data.error;
  }
  http_results.status(ext_status).json(
    {'payload': {}, 'error': error_message, 'message': message}
  );
}


/** Generic handler for internal response */
function handle_internal_response(http_results, int_results){
  let ext_status = int_results.data.status || 500;

  http_results.status(ext_status).json(
    {
      'payload': int_results.data.payload, 'error': int_results.data.error,
      'message': int_results.data.message
    }
  );
}


export {
  BACKEND_SECRET,
  INTERNAL_BACKEND_DOMAIN,
  get_internal_url,
  handle_internal_backend_error,
  handle_internal_response
};
