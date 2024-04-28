import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FuelService } from './fuel.service';
import { Fuel } from '../schemas/fuel.schema';

@Controller('fuels')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Post()
  async create(@Body() createFuelDto: Partial<Fuel>): Promise<Fuel> {
    return this.fuelService.create(createFuelDto);
  }

  @Get(':state?/:city?')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Param('state') state: string = '',
    @Param('city') city: string = '',
  ): Promise<Fuel[]> {
    const formattedCity = city.toUpperCase();
    const formattedState = state.toUpperCase();
    return this.fuelService.findAll(page, limit, formattedCity, formattedState);
  }
}
