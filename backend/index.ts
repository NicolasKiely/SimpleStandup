import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as mongoose from 'mongoose'

import * as model_schema from './schema'

const app = express();
const PORT = 4000;
const DB_NAME = 'standup';

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
    'mongodb://127.0.0.1:27017/standup', {useNewUrlParser: true}
);
const connection = mongoose.connection;

connection.once(
    'open', function() {console.log('Connected to mongodb ' + DB_NAME)}
);

app.listen(PORT, function(err) {
    console.log('[index.ts] Server is running on PORT: ' + PORT);
});
