import { IsString, IsUrl, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { AtsType } from '../entities/company.entity';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsUrl()
  careerPageUrl: string;

  @IsEnum(AtsType)
  atsType: AtsType;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  careerPageUrl?: string;

  @IsOptional()
  @IsEnum(AtsType)
  atsType?: AtsType;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}