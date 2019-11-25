import axios from 'axios';

const ERR_NOT_IMPLEMENTED = 'EXT_NOT_IMPLEMENTED';
const MSG_NOT_IMPLEMENTED = 'External endpoint not implemented';


function auth_login(request, results) {
  results.status(500).json(
    {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
  );
}

function auth_register(request, results) {
  axios.post(
    'http://localhost:8040/auth/user/register/',
    {BACKEND_SECRET: ''}
  ).then(
    res => {
      results.status(500).json(
        {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
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
