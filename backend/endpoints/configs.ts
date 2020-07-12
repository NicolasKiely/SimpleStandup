/** Endpoint for fetching config info */
import * as utils from "../utils";


function getConfig(httpRequest, httpResults){
  httpResults.status(200).json({
    "payload": {"google_analytics": {"id": utils.GOOGLE_ANALYTICS_ID}}
  });
}


export {getConfig}
