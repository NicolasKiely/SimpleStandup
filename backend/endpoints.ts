import axios from 'axios';

const ERR_NOT_IMPLEMENTED = 'EXT_NOT_IMPLEMENTED';
const MSG_NOT_IMPLEMENTED = 'External endpoint not implemented';
const BACKEND_SECRET = process.env['BACKEND_SECRET'] || '';


/**
 * Endpoint to login user.
 * Defers authentication logic to internal backend.
 */
function auth_login(request, results) {
  const send_data = {
    BACKEND_SECRET: BACKEND_SECRET,
    user_email: request.body.login_email,
    user_pass: request.body.login_pass
  };
  axios.post(
    'http://localhost:8040/auth/user/login', send_data
  ).then(
    res => {
      let ext_status = res.data.status || 500;
      let ext_payload = res.data.status == 200 ? {'email': res.data.payload.email} : {};
      results.status(ext_status).json(
        {
          'payload': ext_payload, 'error': res.data.error,
          'message': res.data.message
        }
      );
    },
    err => {
      let ext_status = err.response.data.status || 500;
      results.status(ext_status).json(
        {'payload': {}, 'error': err.response.data.error, 'message': err.response.data.message}
      );
    }
  );
}

/**
 * Endpoint to register new user.
 * Defers registration to internal backend.
 */
function auth_register(request, results) {
  const register_data = {
    BACKEND_SECRET: BACKEND_SECRET,
    user_email: request.body.register_email,
    user_pass: request.body.register_pass,
    user_fname: request.body.register_fname,
    user_lname: request.body.register_lname
  };
  axios.post(
    'http://localhost:8040/auth/user/register', register_data
  ).then(
    res => {
      let ext_message = res.data.message || 'Account successfully registered!';
      results.status(200).json(
        {'payload': {}, 'message': ext_message}
      );
    },
    err => {
      let ext_status = err.response.data.status || 500;
      results.status(ext_status).json(
        {'payload': {}, 'error': err.response.data.error, 'message': err.response.data.message}
      );
    }
  );
}

export {auth_login, auth_register};
