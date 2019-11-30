import axios from 'axios';

const ERR_NOT_IMPLEMENTED = 'EXT_NOT_IMPLEMENTED';
const MSG_NOT_IMPLEMENTED = 'External endpoint not implemented';
const BACKEND_SECRET = process.env['BACKEND_SECRET'] || '';


function auth_login(request, results) {
  results.status(500).json(
    {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
  );
}

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
