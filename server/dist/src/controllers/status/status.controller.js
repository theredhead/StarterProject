"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusController = void 0;
const formatDuration = require("format-duration");
const HttpController_1 = require("../data/HttpController");
class StatusController extends HttpController_1.HttpController {
    constructor(path = '/status') {
        super(path);
        this.startDate = new Date();
        this.index = (req, res) => {
            const uptime = this.uptime;
            const statusOverview = {
                status: 'RUNNING',
                uptime: {
                    ms: uptime,
                    sec: Math.floor(uptime / 100),
                    formatted: formatDuration(uptime, { leading: true }),
                },
            };
            res.send(statusOverview);
        };
        this.registerRoute('GET', '', this.index);
    }
    get uptime() {
        return new Date().getTime() - this.startDate.getTime();
    }
}
exports.StatusController = StatusController;
//# sourceMappingURL=status.controller.js.map