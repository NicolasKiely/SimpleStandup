const ERR_NOT_IMPLEMENTED = 'EXT_NOT_IMPLEMENTED';
const MSG_NOT_IMPLEMENTED = 'External endpoint not implemented';


function auth_login(request, results) {
  results.json(
    {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
  );
  results.status = 500;
}


function auth_register(request, results) {
  results.json(
    {'payload': {}, 'error': ERR_NOT_IMPLEMENTED, 'message': MSG_NOT_IMPLEMENTED}
  );
  results.status = 500;
}


export {auth_login, auth_register};
