import { Injectable } from '@nestjs/common';
import { chromium, Browser, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export interface JobListing {
  title: string;
  company: string;
  location: string;
  link: string;
  isEasyApply?: boolean;
}

@Injectable()
export class LinkedInScraperService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn = false;
  private sessionPath = path.join(process.cwd(), 'linkedin-session.json');

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Check if we already have a valid session
      if (await this.checkSession()) {
        return true;
      }
      
      this.browser = await chromium.launch({ 
        headless: true
      });
      
      const context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
      this.page = await context.newPage();
      
      // Fresh login
      await this.page.goto('https://www.linkedin.com/login');
      await this.page.fill('#username', email);
      await this.page.fill('#password', password);
      await this.page.click('[type="submit"]');
      
      // Wait for login to complete
      await this.page.waitForURL('**/feed/**', { timeout: 30000 });
      
      // Save session with localStorage and cookies
      const cookies = await context.cookies();
      const localStorage = await this.page.evaluate(() => {
        return JSON.stringify(window.localStorage);
      });
      const sessionStorage = await this.page.evaluate(() => {
        return JSON.stringify(window.sessionStorage);
      });
      
      const sessionData = { 
        cookies, 
        localStorage: JSON.parse(localStorage),
        sessionStorage: JSON.parse(sessionStorage),
        timestamp: Date.now() 
      };
      fs.writeFileSync(this.sessionPath, JSON.stringify(sessionData));
      
      this.isLoggedIn = true;
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      await this.close();
      return false;
    }
  }

  async checkSession(): Promise<boolean> {
    if (!fs.existsSync(this.sessionPath)) {
      return false;
    }
    
    const sessionData = JSON.parse(fs.readFileSync(this.sessionPath, 'utf8'));
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Check if session is less than 30 days old
    if (Date.now() - sessionData.timestamp > 30 * dayInMs) {
      fs.unlinkSync(this.sessionPath);
      return false;
    }
    
    try {
      if (!this.browser) {
        this.browser = await chromium.launch({ headless: true });
        const context = await this.browser.newContext({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });
        
        // Restore cookies
        await context.addCookies(sessionData.cookies);
        this.page = await context.newPage();
        
        // Restore localStorage and sessionStorage
        await this.page.goto('https://www.linkedin.com');
        if (sessionData.localStorage) {
          await this.page.evaluate((data) => {
            Object.keys(data).forEach(key => {
              localStorage.setItem(key, data[key]);
            });
          }, sessionData.localStorage);
        }
        if (sessionData.sessionStorage) {
          await this.page.evaluate((data) => {
            Object.keys(data).forEach(key => {
              sessionStorage.setItem(key, data[key]);
            });
          }, sessionData.sessionStorage);
        }
      }
      
      await this.page?.goto('https://www.linkedin.com/feed/');
      await this.page?.waitForTimeout(3000);
      
      if (this.page?.url().includes('/feed/')) {
        this.isLoggedIn = true;
        return true;
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
    
    return false;
  }

  async scrapeJobs(searchTerm: string, location: string = ''): Promise<JobListing[]> {
    // Check session first
    if (!this.isLoggedIn) {
      const sessionValid = await this.checkSession();
      if (!sessionValid) {
        throw new Error('Not logged in to LinkedIn');
      }
    }
    
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}&f_TPR=r86400`;
    
    try {
      await this.page?.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await this.page?.waitForTimeout(5000);
      
      // Scroll to load more jobs
      await this.page?.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await this.page?.waitForTimeout(2000);
      
      // Extract jobs with simpler approach
      const jobs = await this.page?.evaluate(() => {
        const results: JobListing[] | null = [];
        
        // Try different job card selectors
        const jobElements = document.querySelectorAll(
          'li[data-occludable-job-id], .job-card-container, .jobs-search-results__list-item, .base-card'
        );
        
        jobElements.forEach((jobEl) => {
          try {
            let title = '';
            let company = '';
            let location = '';
            let link = '';
            
            // Extract title
            const titleEl = jobEl.querySelector('h3 a, .job-card-list__title a, [data-control-name="job_search_job_title"]');
            if (titleEl) {
              title = titleEl.textContent?.trim() || '';
              link = (titleEl as HTMLAnchorElement).href || '';
            }
            
            // Extract company
            const companyEl = jobEl.querySelector('h4 a, .job-card-container__company-name a, .job-card-list__company-name');
            if (companyEl) {
              company = companyEl.textContent?.trim() || '';
            }
            
            // Extract location
            const locationEl = jobEl.querySelector('.job-card-container__metadata-item, .job-card-list__metadata');
            if (locationEl) {
              location = locationEl.textContent?.trim() || '';
            }
            
            // Check for Easy Apply
            const easyApplyEl = jobEl.querySelector('[data-easy-apply-button], .jobs-apply-button');
            const isEasyApply = !!easyApplyEl;
            
            if (title && company) {
              results.push({
                title,
                company,
                location,
                link,
                isEasyApply
              });
            }
          } catch (e) {
            // Skip this job if extraction fails
          }
        });
        
        return results;
      });
      
      console.log(`Found ${jobs?.length} jobs for search: ${searchTerm}`);
      if(jobs && jobs?.length > 0) {
        return jobs;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error scraping LinkedIn jobs:', error);
      return [];
    }
  }

  async autoApply(jobUrl: string): Promise<boolean> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error('Not logged in to LinkedIn');
    }

    try {
      await this.page.goto(jobUrl);
      await this.page.waitForSelector('.jobs-apply-button', { timeout: 5000 });
      
      const easyApplyButton = await this.page.$('.jobs-apply-button--top-card');
      if (!easyApplyButton) {
        return false;
      }
      
      await easyApplyButton.click();
      await this.page.waitForSelector('.jobs-easy-apply-modal', { timeout: 5000 });
      
      const submitButton = await this.page.$('[data-easy-apply-next-button]');
      if (submitButton) {
        const buttonText = await submitButton.textContent();
        if (buttonText?.includes('Submit')) {
          await submitButton.click();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Auto-apply failed:', error);
      return false;
    }
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  async logout(): Promise<void> {
    if (fs.existsSync(this.sessionPath)) {
      fs.unlinkSync(this.sessionPath);
    }
    this.isLoggedIn = false;
    await this.close();
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}