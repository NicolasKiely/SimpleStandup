import axios from 'axios';

const BACKEND_SECRET = process.env['BACKEND_SECRET'] || '';

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
      let ext_payload = res.data.status == 200 ? {'email': res.data.payload.email} : {};
      results.status(200).json(
        {'payload': ext_payload, 'message': ext_message}
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

export {auth_register};
