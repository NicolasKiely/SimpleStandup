import * as express from 'express'
import * as endpoints from './endpoints'

const standupRoutes = express.Router();

standupRoutes.route('/auth/login').post(endpoints.auth_login);
standupRoutes.route('/auth/register').post(endpoints.auth_register);

export {standupRoutes};
