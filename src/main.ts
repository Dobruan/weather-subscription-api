import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import {DataSource} from "typeorm";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;
  await app.listen(port);
  const dataSource = app.get(DataSource);
  console.log('✅ Entities in Nest context:', dataSource.entityMetadatas.map(e => e.name));
}
bootstrap();
