/**
 * Utility functions
 */

function get_backend_url(path) {
  return (
    window.location.protocol + '//'
    + window.location.hostname + ':4000'
    + path
  );
}

export {get_backend_url};
