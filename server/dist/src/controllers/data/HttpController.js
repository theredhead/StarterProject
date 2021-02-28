"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpController = void 0;
const express = require("express");
class HttpController {
    constructor(basePath = '/api') {
        this.basePath = basePath;
        this.router = express.Router();
    }
    registerRoute(method, path, handler) {
        const pathToRegister = `${this.basePath}/${path}`.replace('//', '/');
        const registerFn = method.toLowerCase();
        try {
            this.router[registerFn](pathToRegister, this.makeRequestHandler(handler));
        }
        catch (e) {
            throw new Error(`Unknown method: "${method}"`);
        }
        console.log(`registered "${method}" route for ${pathToRegister}`);
    }
    beforeProcessRequest(request, response) {
        console.log(`invoking handler for: "${request.method}" ${request.url}`);
    }
    afterProcessRequest(request, response) {
        console.log(`invoked handler for: "${request.method}" ${request.url}`);
    }
    makeRequestHandler(actualHandler) {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.beforeProcessRequest(req, res);
            try {
                actualHandler(req, res);
                res.statusCode = 200;
            }
            catch (e) {
                res.statusCode = 500;
                console.error(e);
            }
            this.afterProcessRequest(req, res);
        });
    }
}
exports.HttpController = HttpController;
//# sourceMappingURL=HttpController.js.map