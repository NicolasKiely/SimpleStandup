const ERR_NOT_IMPLEMENTED = 'EXT_NOT_IMPLEMENTED';
const MSG_NOT_IMPLEMENTED = 'External endpoint not implemented';


function auth_login(request, results) {
  results.status(500).json(
    {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
  );
}


function auth_register(request, results) {
  results.status(500).json(
    {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
  );
}


export {auth_login, auth_register};
