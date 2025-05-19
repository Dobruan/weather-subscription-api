import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriptionDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsEnum(['hourly', 'daily'], {
        message: 'Frequency must be either "hourly" or "daily"',
    })
    frequency: 'hourly' | 'daily';
}
