import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('server-status')
  @ApiOperation({ summary: 'Check server status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Server is running',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Server is up and running!' }
      }
    }
  })
  getServerStatus() {
    return this.appService.getServerStatus();
  }
}