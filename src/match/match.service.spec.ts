import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import requestBody from '../mocks/request-body.json';

describe('MatchService', () => {
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchService],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('matchLists() should return specific matches', () => {
    const matches = service.matchLists(
      requestBody.bookings as Booking[],
      requestBody.claims as Claim[],
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toEqual(
      expect.objectContaining({
        claim: 'claim_10',
        booking: 'booking_9',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mismatch: expect.arrayContaining(['time', 'test']),
      }),
    );
  });
});
