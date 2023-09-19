import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import configuration from './configuration';

@Injectable()
export class MysqlConfigService {
  constructor(
    @Inject(configuration.KEY)
    private MysqlConfiguration: ConfigType<typeof configuration>,
  ) {}

  get host(): string {
    return this.MysqlConfiguration.host;
  }

  get port(): number {
    return Number(this.MysqlConfiguration.port);
  }

  get user(): string {
    return this.MysqlConfiguration.user;
  }

  get password(): string {
    return this.MysqlConfiguration.password;
  }

  get database(): string {
    return this.MysqlConfiguration.database;
  }
}
