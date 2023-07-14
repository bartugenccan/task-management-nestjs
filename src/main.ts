import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Interceptor
import { TransformInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor())
  await app.listen(3000);
}
bootstrap();
