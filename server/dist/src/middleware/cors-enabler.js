"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossOriginResourceSharing = void 0;
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function crossOriginResourceSharing(options = {
    allowedOrigin: '*',
    allowedMethods: ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
}) {
    return (req, res, next) => {
        res.header('Access-Control-Allow-Origin', options.allowedOrigin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', options.allowedMethods.join(', '));
        // res.header('Access-Control-Allow-Origin', '*');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        }
        else {
            next();
        }
    };
}
exports.crossOriginResourceSharing = crossOriginResourceSharing;
//# sourceMappingURL=cors-enabler.js.map