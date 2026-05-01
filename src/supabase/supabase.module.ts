import { Module } from '@nestjs/common';
import { SupabaseKeepAliveService } from './supabase-keep-alive.service';

@Module({
  providers: [SupabaseKeepAliveService],
  exports: [SupabaseKeepAliveService],
})
export class SupabaseModule {}
