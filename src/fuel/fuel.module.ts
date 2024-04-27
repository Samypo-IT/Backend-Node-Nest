import { Module } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Fuel, FuelSchema } from '../schemas/fuel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fuel.name, schema: FuelSchema }]),
  ],
  controllers: [FuelController],
  providers: [FuelService],
})
export class FuelModule {}
