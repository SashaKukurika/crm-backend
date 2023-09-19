import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configuration';
import { MysqlConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      // import only configuration from configuration.ts file
      load: [configuration],
    }),
  ],
  providers: [ConfigService, MysqlConfigService],
  exports: [ConfigService, MysqlConfigService],
})
export class MysqlConfigModule {}
