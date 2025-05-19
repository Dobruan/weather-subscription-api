import { Module } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { TasksService } from './tasks.service';
import {MailService} from "../mail/mail.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "rxjs";
import {WeatherModule} from "../weather/weather.module";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), WeatherModule, MailModule],
  providers: [TasksService,],
  exports: [TasksService]
})
export class TasksModule {}
