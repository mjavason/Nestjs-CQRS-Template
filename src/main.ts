import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/error.filter';
import { loggerConfig } from './common/utils/logger.util';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './common/configs/swagger.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { API_PREFIX, PORT } from './common/configs/constants';

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
