import { Controller, Post, Body } from '@nestjs/common';
import type { MatchDto } from './match.dto';
import { MatchService } from './match.service';

@Controller('match')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Post()
  match(@Body() matchDto: MatchDto) {
    return this.matchService.matchLists(matchDto.bookings, matchDto.claims);
  }
}
