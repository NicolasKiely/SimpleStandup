import * as express from 'express'
import * as endpoints from './endpoints'

const standupRoutes = express.Router();

standupRoutes.route('/auth/login').get(endpoints.auth_login);

export {standupRoutes};
