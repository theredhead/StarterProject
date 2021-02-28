import { Request, Response } from 'express';

export interface CORSOptions {
  allowedOrigin: string;
  allowedMethods: string[];
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function crossOriginResourceSharing(
  options: CORSOptions = {
    allowedOrigin: '*',
    allowedMethods: ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'DELETE'],
  }
) {
  return (req: Request, res: Response, next: any) => {
    res.header('Access-Control-Allow-Origin', options.allowedOrigin);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.header(
      'Access-Control-Allow-Methods',
      options.allowedMethods.join(', ')
    );
    // res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  };
}
