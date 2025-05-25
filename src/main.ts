import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { API_PREFIX, PORT } from './common/configs/constants';
import { setupSwagger } from './common/configs/swagger.config';
import { HttpExceptionFilter } from './common/filter/error.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { loggerConfig } from './common/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: true,
    logger: loggerConfig,
  });

  // CORS Configuration
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  });
  app.setGlobalPrefix(API_PREFIX, {
    exclude: ['/'],
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  setupSwagger(app);

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

bootstrap();
