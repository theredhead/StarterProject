import { Request, Response } from 'express';

export type LoggerFn = (...entry: any) => void;

export const requestLogger = (logger: LoggerFn = console.log) => (
  request: Request,
  response: Response,
  next: any
) => {
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
