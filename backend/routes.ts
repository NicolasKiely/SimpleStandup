import * as express from 'express'
import * as endpoints from './endpoints'
import * as auth_login from './endpoints/user/auth_login'
import * as create_channel from './endpoints/channel/create_channel'
import * as list_channels from './endpoints/channel/list_channels'

const standupRoutes = express.Router();

standupRoutes.route('/auth/login').post(auth_login.auth_login);
standupRoutes.route('/auth/register').post(endpoints.auth_register);
standupRoutes.route("/channels").put(create_channel.create_channel);
standupRoutes.route("/channels").get(list_channels.list_channels);

export {standupRoutes};
