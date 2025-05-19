import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders} from 'axios';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
      imports: [],
    })
        .useMocker((token) => {
          if (token === HttpService) {
            return {
              get: jest.fn(),
            };
          }
        })
        .compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('returns the weather for the city', async () => {
    const mockAxiosResponse: AxiosResponse = {
      data: {
        current: { temp_c: 18, condition: { text: 'Cloudy' } },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),       // headers:AxiosRequestHeaders ==> AxiosHeaders
        method: 'get',
        url: 'https://api.weatherapi.com/',
        timeout: 0,
        withCredentials: false,
        transitional: {},
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse));

    const result = await service.getWeather('Kyiv');

    expect(result).toEqual(mockAxiosResponse.data);
    expect(httpService.get).toHaveBeenCalledWith(
        expect.stringContaining('Kyiv'),
    );
  });

  it('throws an error for failed request', async () => {
    jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('API error')));

    await expect(service.getWeather('Invalid')).rejects.toThrow(InternalServerErrorException);
  });
});
