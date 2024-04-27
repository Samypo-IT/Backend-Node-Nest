import { Controller, Get, Param } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { findMinMaxDates } from '../utils';

@Controller('ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get('last/:state?/:city?')
  async getRankingLast(
    @Param('state') state: string = '',
    @Param('city') city: string = '',
  ) {
    const formattedCity = city.toUpperCase();
    const formattedState = state.toUpperCase();

    const maxDates = await this.rankingService.findMinMaxDates(
      formattedCity,
      formattedState,
    );
    const dates = findMinMaxDates(maxDates);

    return await this.rankingService.findByDateCity(
      dates?.smallestDate,
      dates?.largestDate,
      formattedCity,
      formattedState,
    );
  }

  @Get('month/:state?/:city?')
  async getRankingMonth(
    @Param('state') state: string = '',
    @Param('city') city: string = '',
  ) {
    const formattedCity = city.toUpperCase();
    const formattedState = state.toUpperCase();
    return await this.rankingService.getRankingMonth(
      formattedCity,
      formattedState,
    );
  }
}
