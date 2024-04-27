import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Fuel, FuelSchema } from '../schemas/fuel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fuel.name, schema: FuelSchema }]),
  ],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
