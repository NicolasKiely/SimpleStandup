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
 * @param header Optional header
 */
function backend_request(path, event_handler, method, send_data, header){
  const _method = method || "GET";

  const hdlr = (resolve, reject) => {
    const url = get_backend_url(path);
    let axios_args = {method: _method, url: url, data: send_data};
    if (header !== undefined){
      axios_args["headers"] = header;
    }
    const poster = axios(axios_args);
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


/**
 * Converts date object to ISO date string
 * @param dt {Date} Date object
 * @returns {string} ISO date
 */
function dateToISO(dt){
  const yy = dt.getUTCFullYear();
  const m = dt.getUTCMonth() + 1;
  const d = dt.getUTCDate();

  const mm = m < 10 ? "0" + m : m;
  const dd = d < 10 ? "0" + d : d;

  return `${yy}-${mm}-${dd}`;
}


export {get_backend_url, backend_request, dateToISO};
