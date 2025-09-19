import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';

export class ServerStatusDto {
  @ApiProperty({
    example: 'ok',
    description: 'Health status of the API.',
  })
  status!: string;

  @ApiProperty({
    example: 'API is running',
    description: 'Additional message about the API status.',
  })
  message!: string;

  @ApiProperty({
    example: '1h 23m 45s',
    description: 'Human-readable uptime of the server.',
  })
  uptime!: string;

  @ApiProperty({
    example: '2025-09-18T21:15:00.000Z',
    description: 'Timestamp of the status check in ISO format.',
  })
  timestamp!: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns the current server health status.',
    type: ServerStatusDto,
  })
  getServerStatus(): ServerStatusDto {
    return this.appService.healthy();
  }
}
