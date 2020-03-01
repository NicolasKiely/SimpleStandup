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
 * @param send_data Optional data to send
 */
function post_backend_endpoint(path, event_handler, send_data){
  const hdlr = (resolve, reject) => {
    const url = get_backend_url(path);
    let poster;
    if (send_data === undefined){
      poster = axios.post(url);
    } else {
      poster = axios.post(url, send_data)
    }
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


export {get_backend_url, post_backend_endpoint};
