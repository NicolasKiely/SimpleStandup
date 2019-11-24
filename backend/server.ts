import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());


app.listen(PORT, function() {
    console.log('[server.ts] Server is running on PORT: ' + PORT);
});
