import { Controller, Get, Post, Body, Param, Put, ValidationPipe, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { LinkedInScraperService } from '../scraper/linkedin-scraper.service';
import { SaveJobDto, UpdateJobStatusDto } from './dto/job.dto';
import { ApplicationStatus } from './entities/job.entity';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly linkedInScraperService: LinkedInScraperService,
  ) {}

  @Post('save')
  saveJob(@Body(ValidationPipe) saveJobDto: SaveJobDto) {
    return this.jobsService.saveJob(saveJobDto);
  }

  @Get()
  findAll(@Query('status') status?: ApplicationStatus) {
    if (status) {
      return this.jobsService.findByStatus(status);
    }
    return this.jobsService.findAll();
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateJobStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobsService.updateStatus(id, updateJobStatusDto);
  }

  @Post('auto-apply/:id')
  async autoApply(@Param('id') id: string) {
    const jobs = await this.jobsService.findAll();
    const job = jobs.find(j => j.id === id);
    
    if (!job) {
      throw new Error('Job not found');
    }

    const success = await this.linkedInScraperService.autoApply(job.linkedinUrl);
    
    if (success) {
      await this.jobsService.updateStatus(id, { status: ApplicationStatus.APPLIED });
    }
    
    return { success, message: success ? 'Applied successfully' : 'Auto-apply failed' };
  }
}