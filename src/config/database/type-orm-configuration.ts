import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { MysqlConfigModule } from './config.module';
import { MysqlConfigService } from './configuration.service';

export class TypeOrmConfiguration {
  static get config(): TypeOrmModuleAsyncOptions {
    return {
      imports: [MysqlConfigModule],
      useFactory: (configService: MysqlConfigService) => ({
        type: 'mysql',
        host: configService.host,
        port: configService.port,
        username: configService.user,
        password: configService.password,
        database: configService.database,
        synchronize: true,
        entities: [`${process.cwd()}/**/*.entity{.js, .ts}`],
        migrationsTableName: 'migrations',
      }),
      inject: [MysqlConfigService],
    };
  }
}
