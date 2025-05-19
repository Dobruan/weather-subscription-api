import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {Subscription} from "./subscription.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateSubscriptionDto} from "./dto/create-subscription.dto";
import { randomUUID } from 'crypto';
import {MailService} from "../mail/mail.service";

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        private readonly mailService: MailService,
    ) {}

    async createSubscription(dto: CreateSubscriptionDto) {
        const { email, city, frequency } = dto;

        const existing = await this.subscriptionRepository.findOneBy({ email });

        if (existing) {
            throw new ConflictException('Email already subscribed');
        }

        const token = randomUUID();

        const subscription = this.subscriptionRepository.create({
            email,
            city,
            frequency,
            confirmed: false,
            confirmationToken: token,
        });

        await this.subscriptionRepository.save(subscription);

        await this.mailService.sendConfirmationEmail(email, token);

        return {
            message: 'Subscription successful. Confirmation email sent.',
        };
    }

    async confirmSubscription(token: string) {
        const subscription = await this.subscriptionRepository.findOneBy({ confirmationToken: token });

        if (!subscription) {
            throw new NotFoundException('Invalid token');
        }

        if (subscription.confirmed) {
            throw new BadRequestException('Subscription already confirmed');
        }

        subscription.confirmed = true;
        subscription.confirmationToken = undefined; // очищаємо, щоб токен був одноразовим

        await this.subscriptionRepository.save(subscription);

        return { message: 'Subscription confirmed successfully' };
    }
    async unsubscribe(token: string) {
        const subscription = await this.subscriptionRepository.findOneBy({ confirmationToken: token });
        if (!subscription) {
            throw new NotFoundException('Invalid token');
        }
        await this.subscriptionRepository.remove(subscription);
        return { message: 'Subscription unsubscribed successfully' };
    }
}
