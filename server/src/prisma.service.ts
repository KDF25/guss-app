import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Обработка завершения приложения
    process.on('beforeExit', async () => {
      await app.close();
    });
    process.on('SIGINT', async () => {
      await app.close();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      await app.close();
      process.exit(0);
    });
  }
}
