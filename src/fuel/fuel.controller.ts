import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
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

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<Fuel[]> {
    return this.fuelService.findAll(page, limit);
  }
}
