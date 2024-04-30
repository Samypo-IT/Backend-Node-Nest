import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station, StationDocument } from '../schemas/station.schema';

@Injectable()
export class StationService {
  constructor(@InjectModel(Station.name) private stationModel: Model<StationDocument>) {}

  async create(createStationDto: Partial<Station>): Promise<Station> {
    const createdStation = new this.stationModel(createStationDto);
    return createdStation.save();
  }

  async findAll(
    page = 1,
    limit = 20,
    city = null,
    state = null,
  ): Promise<Station[]> {
    const skip = (page - 1) * limit;
    const query = {};

    if (state) {
      query['state_abbr'] = state;
    }
    if (city) {
      query['city'] = city;
    }
    return this.stationModel.find(query).skip(skip).limit(limit).exec();
  }
}
