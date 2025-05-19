import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Subscription} from "./subscription.entity";
import {MailModule} from "../mail/mail.module";
import {TasksModule} from "../tasks/tasks.module";

@Module({
  imports:[TypeOrmModule.forFeature([Subscription]),MailModule,TasksModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService]
})
export class SubscriptionModule {}
