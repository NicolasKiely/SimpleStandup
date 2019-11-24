import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as api_routes from './routes/api'

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/v/1', api_routes.standupRoutes);


app.listen(PORT, function() {
    console.log('[server.ts] Server is running on PORT: ' + PORT);
});
