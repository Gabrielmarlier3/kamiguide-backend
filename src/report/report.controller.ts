import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateReportDto } from './dto/request/createReportDto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create an new report' })
  @ApiCreatedResponse({
    description: 'Report created',
    example: { message: 'Report created' },
  })
  async create(@Body() body: CreateReportDto) {
    await this.reportService.createIssue(body);
    return { status: 201, message: 'Report created' };
  }
}
