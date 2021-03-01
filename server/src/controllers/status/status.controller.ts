import { Request, Response } from 'express';
import { HttpController } from '../data/HttpController';

export class StatusController extends HttpController {
  private readonly startDate = new Date();
  private get uptime(): number {
    return new Date().getTime() - this.startDate.getTime();
  }
  constructor(path = '/status') {
    super(path);
    this.registerRoute('GET', '', this.index);
  }

  index = (req: Request, res: Response) => {
    const uptime = this.uptime;
    const statusOverview = {
      status: 'RUNNING',
      uptime: {
        ms: uptime,
        sec: Math.floor(uptime / 100),
        // formatted: formatDuration(uptime, { leading: true }),
      },
    };

    res.send(statusOverview);
  };
}
