import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateReportDto } from './dto/request/createReportDto';

@Injectable()
export class ReportService {
  async createIssue(data: CreateReportDto) {
    const token = process.env.GITHUB_TOKEN;
    const repo = 'Gabrielmarlier3/kamiguide-frontend';

    const labelsMap = {
      bug: 'bug',
      content: 'content',
      feature: 'enhancement',
      feedback: 'feedback',
    } as const;

    const typeKey = String(data.type).toLowerCase() as keyof typeof labelsMap;
    const label = labelsMap[typeKey] ?? 'enhancement';

    const body = [
      `**Type:** ${typeKey}`,
      data.name ? `**Name:** ${data.name}` : '',
      data.email ? `**Email:** ${data.email}` : '',
      '',
      '**Description**',
      data.description,
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      title: `[${typeKey.toUpperCase()}] ${data.subject}`,
      body,
      labels: [label],
    };

    const res = await axios.post(
      `https://api.github.com/repos/${repo}/issues`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
      },
    );

    return { success: res.status === 201 };
  }
}
