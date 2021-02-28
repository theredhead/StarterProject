import * as express from 'express';
import { Application } from 'express';

export interface AppSettings {
  port: number;
  middleWares: any;
  controllers: any;
}

class App {
  readonly app: Application;
  readonly port: number;

  constructor(config: AppSettings) {
    this.app = express();
    this.port = config.port;

    this.middlewares(config.middleWares);
    this.routes(config.controllers);
    this.assets();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Listening on http://localhost:${this.port}`);
    });
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private assets() {
    this.app.use(express.static('public'));
  }
}

export default App;
