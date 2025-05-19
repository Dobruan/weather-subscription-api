import {Module} from '@nestjs/common';
import {WeatherModule} from './weather/weather.module';
import {SubscriptionModule} from './subscription/subscription.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from '@nestjs/config';
import {Subscription} from './subscription/subscription.entity';
import {MailModule} from './mail/mail.module';
import {TasksModule} from './tasks/tasks.module';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) =>
                ({
                    type: 'postgres',
                    host: config.get('DATABASE_HOST'),
                    port: config.get<number>('DATABASE_PORT'),
                    username: config.get('DATABASE_USER'),
                    password: config.get('DATABASE_PASSWORD'),
                    database: config.get('DATABASE_NAME'),
                    entities: [Subscription],
                  synchronize: false,
                    migrations: ['dist/migrations/*.js'],
                    migrationsRun: true,
                }),
            inject: [ConfigService],
        }),
        WeatherModule, SubscriptionModule, MailModule, TasksModule, ScheduleModule.forRoot(),],
    controllers: [],
    providers: [],
})
export class AppModule {
}
