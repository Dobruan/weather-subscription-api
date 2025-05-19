import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [WeatherService],
  controllers: [WeatherController],
  imports: [HttpModule],
  exports: [WeatherService]
})
export class WeatherModule {}
