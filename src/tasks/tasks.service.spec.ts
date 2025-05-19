import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from '../subscription/subscription.entity';
import { WeatherService } from '../weather/weather.service';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';

const mockSubscriptionRepo = () => ({
  find: jest.fn(),
  save: jest.fn(),
});

const mockWeatherService = () => ({
  getWeather: jest.fn(),
});

const mockMailService = () => ({
  sendWeatherUpdate: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<Subscription>>;
  let weather: ReturnType<typeof mockWeatherService>;
  let mail: ReturnType<typeof mockMailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Subscription), useFactory: mockSubscriptionRepo },
        { provide: WeatherService, useFactory: mockWeatherService },
        { provide: MailService, useFactory: mockMailService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Subscription));
    weather = module.get(WeatherService);
    mail = module.get(MailService);
  });

  it('sends weather if frequency is "hourly" and more than 60 min have passed', async () => {
    const sub = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: 'hourly',
      confirmed: true,
      lastSentAt: new Date(Date.now() - 61 * 60 * 1000), // 61 min have passed
    } as Subscription;

    repo.find.mockResolvedValue([sub]);
    weather.getWeather.mockResolvedValue({
      current: { temp_c: 20, condition: { text: 'Sunny' } },
    });

    await service.sendWeatherUpdates();

    expect(mail.sendWeatherUpdate).toHaveBeenCalledWith(
        sub.email,
        expect.stringContaining('Kyiv'),
    );
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ lastSentAt: expect.any(Date) }));
  });

  it('does not send if less than 60 minutes have passed for hourly', async () => {
    const sub = {
      email: 'early@example.com',
      city: 'Lviv',
      frequency: 'hourly',
      confirmed: true,
      lastSentAt: new Date(), // тільки-но
    } as Subscription;

    repo.find.mockResolvedValue([sub]);

    await service.sendWeatherUpdates();

    expect(mail.sendWeatherUpdate).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('does not send if subscription is not confirmed', async () => {
    const sub = {
      email: 'unconfirmed@example.com',
      confirmed: false,
    } as Subscription;

    repo.find.mockResolvedValue([sub]);

    await service.sendWeatherUpdates();

    expect(mail.sendWeatherUpdate).not.toHaveBeenCalled();
  });

  it('catches an error if the weather API crashes', async () => {
    const sub = {
      email: 'fail@example.com',
      city: 'Odesa',
      frequency: 'hourly',
      confirmed: true,
      lastSentAt: new Date(Date.now() - 61 * 60 * 1000),
    } as Subscription;

    repo.find.mockResolvedValue([sub]);
    weather.getWeather.mockRejectedValue(new Error('Weather API fail'));

    await service.sendWeatherUpdates();

    expect(mail.sendWeatherUpdate).not.toHaveBeenCalled();
  });
});
