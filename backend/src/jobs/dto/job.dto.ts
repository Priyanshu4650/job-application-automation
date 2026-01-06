import { IsString, IsUrl, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApplicationStatus } from '../entities/job.entity';

export class SaveJobDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsUrl()
  linkedinUrl: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isEasyApply?: boolean;
}

export class UpdateJobStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}