import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {firstValueFrom} from "rxjs";

@Injectable()
export class WeatherService {
    constructor(private readonly httpService: HttpService) {}
    async getWeather(city: string): Promise<any> {
        try {
            const apiKey = process.env.WEATHER_API_KEY;
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const response = await firstValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch weather');
        }
    }
}
