import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Post,
  Query,
} from '@nestjs/common';
import { StationService } from './station.service';
import { Station } from '../schemas/station.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estabelecimentos')
@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  /*
  @Post()
  async create(@Body() createStationDto: Partial<Station>): Promise<Station> {
    return this.stationService.create(createStationDto);
  }
  */

  @Get(':state?/:city?')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Param('state') state: string = '',
    @Param('city') city: string = '',
  ): Promise<Station[]> {
    const formattedCity = city.toUpperCase();
    const formattedState = state.toUpperCase();
    return this.stationService.findAll(
      page,
      limit,
      formattedCity,
      formattedState,
    );
  }

  @Get(':state?/:city?/last')
  async findLast(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Param('state') state: string = '',
    @Param('city') city: string = '',
    @Param('products') products: string[] = [],
  ): Promise<Station[]> {
    const formattedCity = city.toUpperCase();
    const formattedState = state.toUpperCase();
    return this.stationService.findLast(
      page,
      limit,
      formattedCity,
      formattedState,
      products,
    );
  }
}
