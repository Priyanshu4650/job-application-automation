import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, ApplicationStatus } from './entities/job.entity';
import { SaveJobDto, UpdateJobStatusDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async saveJob(saveJobDto: SaveJobDto): Promise<Job> {
    const existingJob = await this.jobsRepository.findOne({
      where: { linkedinUrl: saveJobDto.linkedinUrl },
    });

    if (existingJob) {
      return existingJob;
    }

    const job = this.jobsRepository.create(saveJobDto);
    return this.jobsRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, updateJobStatusDto: UpdateJobStatusDto): Promise<Job> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    job.status = updateJobStatusDto.status;
    return this.jobsRepository.save(job);
  }

  async findByStatus(status: ApplicationStatus): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }
}