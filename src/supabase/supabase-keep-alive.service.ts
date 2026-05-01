import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SupabaseKeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseKeepAliveService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Supabase Keep-Alive service initialized');
    // Run once on startup after a small delay to ensure everything is ready
    setTimeout(() => this.keepAlive(), 5000);
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron() {
    await this.keepAlive();
  }

  private async keepAlive() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('SUPABASE_URL or SUPABASE_KEY not found in environment variables');
      return;
    }

    try {
      this.logger.log('Sending keep-alive request to Supabase...');
      
      // We hit the User table with a limit of 1 to minimize data transfer
      const response = await fetch(`${supabaseUrl}/rest/v1/User?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      if (response.ok) {
        this.logger.log('Supabase keep-alive successful');
      } else {
        // Fallback to base endpoint if User table is not reachable for some reason
        const baseResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
            },
          });
        
        if (baseResponse.ok) {
            this.logger.log('Supabase keep-alive successful (via base endpoint)');
        } else {
            const errorText = await baseResponse.text();
            this.logger.warn(`Supabase keep-alive returned status ${baseResponse.status}: ${errorText}`);
        }
      }
    } catch (error) {
      this.logger.error('Error during Supabase keep-alive request:', error.message);
    }
  }
}
