import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { LinkedInScraperService } from './linkedin-scraper.service';

@Module({
  controllers: [ScraperController],
  providers: [LinkedInScraperService],
})
export class ScraperModule {}