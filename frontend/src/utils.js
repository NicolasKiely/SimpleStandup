/**
 * Utility functions
 */
import axios from 'axios';


function get_backend_url(path) {
  return (
    window.location.protocol + '//'
    + window.location.hostname + ':4000'
    + path
  );
}


/**
 * Returns promise that calls endpoint
 * @param path Internal backend endpoint
 * @param event_handler Global event handler
 * @param method HTTP method (get, post, put)
 * @param send_data Optional data to send
 */
function backend_request(path, event_handler, method, send_data){
  const _method = method || "GET";

  const hdlr = (resolve, reject) => {
    const url = get_backend_url(path);
    const poster = axios({method: _method, url: url, data: send_data});
    poster.then(
      (results) => {
        resolve(results);
      },
      (err) => {
        event_handler(err);
        reject(err);
      }
    );
  };
  return new Promise(hdlr);
}


export {get_backend_url, backend_request};
