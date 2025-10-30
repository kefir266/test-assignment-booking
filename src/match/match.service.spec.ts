import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import requestBody from '../mocks/request-body.json';
import mockedBookings from '../mocks/bookings.json';
import mockedClaims from '../mocks/claims.json';
import mockedResponse from '../mocks/mocked-response-of-matches.json';

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

  it('should return empty array if one of the lists is empty', () => {
    const mathces = service.matchLists(requestBody.bookings as Booking[], []);
    expect(mathces).toEqual([]);
  });

  it('matchLists() should return specific matches #1', () => {
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

  it('matchLists() should return specific matches #2', () => {
    const matches = service.matchLists(
      mockedBookings as Booking[],
      mockedClaims as Claim[],
    );

    expect(matches).toHaveLength(8);
    expect(matches).toEqual(expect.arrayContaining(mockedResponse as Match[]));
  });
});
