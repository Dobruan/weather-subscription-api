import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Subscription} from "../subscription/subscription.entity";
import {WeatherService} from "../weather/weather.service";
import {MailService} from "../mail/mail.service";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepo: Repository<Subscription>,
        private readonly weatherService: WeatherService,
        private readonly mailService: MailService,
    ) {}

    @Cron('0 * * * *') // щогодини
    async sendWeatherUpdates() {
        const now = new Date();

        const subscriptions = await this.subscriptionRepo.find({
            where: { confirmed: true },
        });

        for (const sub of subscriptions) {
            const last = sub.lastSentAt || new Date(0);
            const diffMin = this.diffInMinutes(last, now);
            const diffHrs = this.diffInHours(last, now);

            const shouldSend =
                (sub.frequency === 'hourly' && diffMin >= 60) ||
                (sub.frequency === 'daily' && diffHrs >= 24);

            if (!shouldSend) {
                const reason =
                    sub.frequency === 'hourly'
                        ? `Hourly: only ${diffMin} min ago`
                        : `Daily: only ${diffHrs} hours ago`;

                this.logger.debug(`🔁 Skip ${sub.email} — ${reason}`);
                continue;
            }

            try {
                const weather = await this.weatherService.getWeather(sub.city);
                const summary = `${sub.city}: ${weather.current.temp_c}°C, ${weather.current.condition.text}`;

                await this.mailService.sendWeatherUpdate(sub.email, summary);

                sub.lastSentAt = now;
                await this.subscriptionRepo.save(sub);

                this.logger.log(`Sent to ${sub.email} — ${summary}`);
            } catch (err) {
                this.logger.error(`Failed for ${sub.email}: ${err.message}`);
            }
        }
    }

    private diffInMinutes(a: Date, b: Date): number {
        return Math.floor((b.getTime() - a.getTime()) / (1000 * 60));
    }

    private diffInHours(a: Date, b: Date): number {
        return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60));
    }

}
