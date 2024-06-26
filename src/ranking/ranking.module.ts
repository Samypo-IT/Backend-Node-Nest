import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Station, StationSchema } from '../schemas/station.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
  ],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
