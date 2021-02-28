"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (logger = console.log) => (request, response, next) => {
    const entry = {
        date: new Date(),
        method: request.method,
        requestUrl: request.url,
        clientIp: request.ip,
        status: response.statusCode,
    };
    logger('[Request]', entry);
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.js.map