import * as express from 'express';
import { Request, Response } from 'express';

export type RequestHandlerFn = (req: Request, res: Response) => void;
export type HttpMethod =
  | 'GET'
  | 'PUT'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export abstract class HttpController {
  protected readonly router = express.Router();
  constructor(readonly basePath = '/api') {}

  protected registerRoute(
    method: HttpMethod,
    path: string,
    handler: RequestHandlerFn
  ) {
    const pathToRegister = `${this.basePath}/${path}`.replace('//', '/');
    const registerFn = method.toLowerCase();

    try {
      (this.router as any)[registerFn](
        pathToRegister,
        this.makeRequestHandler(handler)
      );
    } catch (e) {
      throw new Error(`Unknown method: "${method}"`);
    }

    console.log(`registered "${method}" route for ${pathToRegister}`);
  }
  protected beforeProcessRequest(request: Request, response: Response): void {
    console.log(`invoking handler for: "${request.method}" ${request.url}`);
  }
  protected afterProcessRequest(request: Request, response: Response): void {
    console.log(`invoked handler for: "${request.method}" ${request.url}`);
  }

  private makeRequestHandler(
    actualHandler: RequestHandlerFn
  ): RequestHandlerFn {
    return async (req: Request, res: Response) => {
      this.beforeProcessRequest(req, res);
      try {
        actualHandler(req, res);
        res.statusCode = 200;
      } catch (e) {
        res.statusCode = 500;
        console.error(e);
      }
      this.afterProcessRequest(req, res);
    };
  }
}
