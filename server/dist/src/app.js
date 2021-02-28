"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class App {
    constructor(config) {
        this.app = express();
        this.port = config.port;
        this.middlewares(config.middleWares);
        this.routes(config.controllers);
        this.assets();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Listening on http://localhost:${this.port}`);
        });
    }
    middlewares(middleWares) {
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }
    routes(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    assets() {
        this.app.use(express.static('public'));
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map