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
import { ApiQuery, ApiTags } from '@nestjs/swagger';

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

  @Get('/')
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'long', required: false, type: Number })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('lat') lat?: number,
    @Query('long') long?: number,
    @Query('products') products: string[] = [],
  ): Promise<Station[]> {
    const formattedCity = city?.toUpperCase();
    const formattedState = state?.toUpperCase();
    return this.stationService.findAll(
      page,
      limit,
      formattedCity,
      formattedState,
      lat,
      long,
      products,
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
