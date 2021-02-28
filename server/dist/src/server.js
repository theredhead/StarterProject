"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bodyParser = require("body-parser");
const status_controller_1 = require("./controllers/status/status.controller");
const request_logger_1 = require("./middleware/request-logger");
const cors_enabler_1 = require("./middleware/cors-enabler");
const data_access_controller_1 = require("./controllers/data/data-access.controller");
const app = new app_1.default({
    port: 5000,
    controllers: [new status_controller_1.StatusController(), new data_access_controller_1.DataAccessController()],
    middleWares: [
        cors_enabler_1.crossOriginResourceSharing(),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        request_logger_1.requestLogger((...e) => console.log(`[LOG]: `, ...e)),
    ],
});
app.listen();
//# sourceMappingURL=server.js.map