import { Injectable } from '@nestjs/common';
import { ServerStatusDto } from './app.controller';

@Injectable()
export class AppService {
  healthy(): ServerStatusDto {
    return {
      status: 'ok',
      message: 'API is running',
      uptime: this.formatUptime(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h${minutes}m${secs}s`;
  }
}
