import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {SubscriptionService} from "./subscription.service";
import {CreateSubscriptionDto} from "./dto/create-subscription.dto";

@Controller('api')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}
    @Post('subscribe')
    async subscribe(@Body() dto: CreateSubscriptionDto) {
        return this.subscriptionService.createSubscription(dto);
    }

    @Get('confirm/:token')
    async confirm(@Param('token') token: string) {
        return this.subscriptionService.confirmSubscription(token);
    }

    @Get('unsubscribe/:token')
    async unsubscribe(@Param('token') token: string) {
        return this.subscriptionService.unsubscribe(token);
    }
}
