import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station, StationDocument } from '../schemas/station.schema';

@Injectable()
export class StationService {
  constructor(
    @InjectModel(Station.name) private stationModel: Model<StationDocument>,
  ) {}

  async create(createStationDto: Partial<Station>): Promise<Station> {
    const createdStation = new this.stationModel(createStationDto);
    return createdStation.save();
  }

  async findAll(
    page = 1,
    limit = 20,
    city = null,
    state = null,
    lat = null,
    long = null,
    products: string[] = [],
  ): Promise<Station[]> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (state) {
      query['state_abbr'] = state;
    }
    if (city) {
      query['city'] = city;
    }
    if (products.length > 0) {
      query['product'] = { $in: products };
    }

    if (lat && long) {
      return this.stationModel
        .find(query)
        .where('location')
        .near({
          center: {
            type: 'Point',
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          distanceField: 'distance',
          spherical: true,
        })
        .sort({ distance: 1 })
        .skip(skip)
        .limit(limit)
        .exec();
    } else {
      return this.stationModel.find(query).skip(skip).limit(limit).exec();
    }
  }

  async findLast(
    page = 1,
    limit = 20,
    city = null,
    state = null,
    products: string[] = [],
  ): Promise<Station[]> {
    const skip = (page - 1) * limit;
    const matchQuery: any = {};

    if (state !== null) {
      matchQuery.state_abbr = state;
    }
    if (city !== null) {
      matchQuery.city = city;
    }
    if (products.length > 0) {
      matchQuery.product = { $in: products };
    }

    return this.stationModel
      .aggregate([
        {
          $match: matchQuery,
        },
        {
          $group: {
            _id: '$product',
            last_collection_date: { $max: '$collection_date' },
          },
        },
        {
          $lookup: {
            from: 'stations',
            let: {
              product: '$_id',
              last_date: '$last_collection_date',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$product', '$$product'] },
                      { $eq: ['$collection_date', '$$last_date'] },
                      { $eq: ['$city', city] },
                      { $eq: ['$state_abbr', state] },
                    ],
                  },
                },
              },
            ],
            as: 'latest_records',
          },
        },
        {
          $unwind: '$latest_records',
        },
        {
          $replaceRoot: { newRoot: '$latest_records' },
        },
        { $sort: { sale_value: 1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();
  }
}
