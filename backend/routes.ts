import * as express from 'express'
import * as endpoints from './endpoints'
import * as auth_login from './endpoints/auth_login'

const standupRoutes = express.Router();

standupRoutes.route('/auth/login').post(auth_login.auth_login);
standupRoutes.route('/auth/register').post(endpoints.auth_register);

export {standupRoutes};
