import App from './app';

import * as bodyParser from 'body-parser';
import { StatusController } from './controllers/status/status.controller';
import { requestLogger } from './middleware/request-logger';
import { crossOriginResourceSharing } from './middleware/cors-enabler';
import { DataAccessController } from './controllers/data/data-access.controller';

const app = new App({
  port: 5000,
  controllers: [new StatusController(), new DataAccessController()],
  middleWares: [
    crossOriginResourceSharing(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    requestLogger((...e: any[]) => console.log(`[LOG]: `, ...e)),
  ],
});

app.listen();
