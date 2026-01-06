import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { LinkedInScraperService } from './linkedin-scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly linkedInScraperService: LinkedInScraperService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const success = await this.linkedInScraperService.login(loginDto.email, loginDto.password);
    return { success, message: success ? 'Logged in successfully' : 'Login failed' };
  }

  @Get('status')
  async getStatus() {
    const isLoggedIn = await this.linkedInScraperService.checkSession() || this.linkedInScraperService.getLoginStatus();
    return { isLoggedIn };
  }

  @Post('logout')
  async logout() {
    await this.linkedInScraperService.logout();
    return { success: true, message: 'Logged out successfully' };
  }

  @Get('linkedin-jobs')
  async scrapeLinkedInJobs(
    @Query('search') searchTerm: string,
    @Query('location') location?: string,
  ) {
    return this.linkedInScraperService.scrapeJobs(searchTerm, location);
  }
}