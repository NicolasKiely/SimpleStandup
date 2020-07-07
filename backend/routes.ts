import * as express from 'express'
import * as endpoints from './endpoints'
import * as auth_login from './endpoints/user/auth_login'
import * as create_channel from './endpoints/channel/create_channel'
import * as list_channels from './endpoints/channel/list_channels'
import * as archive_channel from './endpoints/channel/archive_channel'
import * as invite from './endpoints/channel/invite'
import * as message_channel from "./endpoints/channel/message"
import * as list_unread from './endpoints/notifications/list_unread'
import * as update_notification from './endpoints/notifications/response'

const standupRoutes = express.Router();

standupRoutes.route('/auth/login')
  .post(auth_login.auth_login);
standupRoutes.route('/auth/register')
  .post(endpoints.auth_register);
standupRoutes.route("/channels")
  .put(create_channel.create_channel);
standupRoutes.route("/channels")
  .get(list_channels.list_channels);
standupRoutes.route("/channels/:channel_id")
  .delete(archive_channel.archive_channel);
standupRoutes.route("/channels/:channel_id/invites")
  .put(invite.invite_user);
standupRoutes.route("/channels/:channel_id/messages")
  .post(message_channel.messageChannel);
standupRoutes.route("/notifications/unread")
  .get(list_unread.listUnread);
standupRoutes.route("/notifications/:note_id")
  .patch(update_notification.updateNotification);

export {standupRoutes};
