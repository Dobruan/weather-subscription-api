import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const mockSubscriptionRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const mockMailService = () => ({
  sendConfirmationEmail: jest.fn(),
});

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let repo: jest.Mocked<Repository<Subscription>>;
  let mail: ReturnType<typeof mockMailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        { provide: getRepositoryToken(Subscription), useFactory: mockSubscriptionRepository },
        { provide: MailService, useFactory: mockMailService },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    repo = module.get(getRepositoryToken(Subscription));
    mail = module.get(MailService);
  });

  it('creates a new subscription', async () => {
    repo.findOneBy.mockResolvedValue(null);
    repo.create.mockReturnValue({ email: 'unit_test@example.com' } as Subscription);

    await service.createSubscription({
      email: 'unit_test@example.com',
      city: 'Kyiv',
      frequency: 'daily',
    });

    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(mail.sendConfirmationEmail).toHaveBeenCalled();
  });

  it('throws an error if email already exists', async () => {
    repo.findOneBy.mockResolvedValue({ email: 'existing@example.com' } as Subscription);

    await expect(
        service.createSubscription({
          email: 'existing@example.com',
          city: 'Kyiv',
          frequency: 'daily',
        }),
    ).rejects.toThrow(ConflictException);
  });

  it('confirms subscription', async () => {
    const subscription = { confirmed: false, confirmationToken: 'abc' } as Subscription;
    repo.findOneBy.mockResolvedValue(subscription);
    repo.save.mockResolvedValue(subscription);

    const result = await service.confirmSubscription('abc');

    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Subscription confirmed successfully' });
  });

  it('throws an error if the confirmation token is not found', async () => {
    repo.findOneBy.mockResolvedValue(null);

    await expect(service.confirmSubscription('bad-token')).rejects.toThrow(NotFoundException);
  });
});
