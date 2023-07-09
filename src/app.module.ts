import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from '@/middleware/logging.middleware';
import type { MiddlewareConsumer } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
