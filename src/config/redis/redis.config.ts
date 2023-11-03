import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

export const getRedisConfig = async (
  configService: ConfigService,
): Promise<RedisModuleOptions> => {
  return {
    config: {
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    },
  };
};
