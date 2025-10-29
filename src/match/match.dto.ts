import { IsArray } from 'class-validator';

export class MatchDto {
  @IsArray({ message: 'bookings must be array' })
  bookings: Booking[];

  @IsArray({ message: 'claims must be array' })
  claims: Claim[];
}
