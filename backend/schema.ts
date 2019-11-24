import * as mongoose from 'mongoose'
const Schema = mongoose.Schema;

/* Note from a user in standup meeting instance */
let StandupNoteSchema = new Schema({
    yesterdayMessage: {
        type: String
    },
    todayMessage: {
        type: String
    },
});

export { StandupNoteSchema };
