import { AllExceptionsFilter } from '@core/filter/all-exceptions.filter';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@shared/services/config.service';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = new ConfigService();
  const port = process.env.PORT || 8080;

  if (configService.isEnableSwagger) {
    setupSwagger(app);
  }

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);

  console.info(`Server running on port ${port}`);
  console.info(`API Documentation http://localhost:${port}/docs`);
}
bootstrap().catch((err) => {
  console.error(err);
});
