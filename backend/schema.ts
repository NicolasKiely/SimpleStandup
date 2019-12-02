import * as mongoose from 'mongoose'
const Schema = mongoose.Schema;

/**
 * Note from a user in standup meeting instance
 */
let StandupNoteSchema = new Schema({
    yesterdayMessage: {
        type: String
    },
    todayMessage: {
        type: String
    },
});
mongoose.model('Standup', StandupNoteSchema);

/**
 * Schema for user profile + token-auth
 */
let UserProfileSchema = new Schema({
  email: {
    type: String
  },
  token: {
    type: String
  },
  expiration: {
    type: Date
  }
});
let UserProfile = mongoose.model('UserProfile', UserProfileSchema);

export {StandupNoteSchema, UserProfileSchema, UserProfile};
