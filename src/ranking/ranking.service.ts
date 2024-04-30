import { Injectable } from '@nestjs/common';
import { RANKING } from './ranking.mock';
import { errorReturn } from '../utils';
import { Station } from '../schemas/station.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RankingService {
  ranking = RANKING;

  constructor(@InjectModel(Station.name) private fuelModel: Model<Station>) {}

  async findByDateCity(
    minDate: string,
    maxDate: string,
    city: string,
    state: string,
  ): Promise<any> {
    if (!minDate || !maxDate || !city || !state) {
      return errorReturn();
    }

    return this.fuelModel
      .aggregate([
        {
          $match: {
            collection_date: {
              $gte: minDate,
              $lte: maxDate,
            },
            state_abbr: state,
            city: city,
          },
        },
        {
          $group: {
            _id: {
              city: '$city',
              state_abbr: '$state_abbr',
              product: '$product',
            },
            cheapest_resellers: {
              $push: {
                reseller_cnpj: '$reseller_cnpj',
                average_sale_value: {
                  $avg: {
                    $toDouble: '$sale_value',
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            city: '$_id.city',
            state_abbr: '$_id.state_abbr',
            product: '$_id.product',
            cheapest_resellers: {
              $slice: ['$cheapest_resellers', 10],
            },
          },
        },
        {
          $unwind: '$cheapest_resellers',
        },
        {
          $sort: {
            'cheapest_resellers.average_sale_value': 1,
          },
        },
        {
          $group: {
            _id: {
              city: '$city',
              state_abbr: '$state_abbr',
              product: '$product',
            },
            cheapest_resellers: {
              $push: '$cheapest_resellers',
            },
          },
        },
        {
          $group: {
            _id: {
              city: '$_id.city',
              state_abbr: '$_id.state_abbr',
            },
            products: {
              $push: {
                name: '$_id.product',
                cheapest_resellers: '$cheapest_resellers',
              },
            },
          },
        },
        {
          $sort: {
            '_id.state_abbr': 1,
            '_id.city': 1,
          },
        },
        {
          $group: {
            _id: null,
            cities: {
              $push: {
                city: '$_id.city',
                state_abbr: '$_id.state_abbr',
                products: '$products',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            cities: 1,
          },
        },
      ])
      .exec();
  }

  async findMinMaxDates(city: string, state: string): Promise<any> {
    return this.fuelModel
      .aggregate([
        {
          $match: {
            city: city,
            state_abbr: state,
          },
        },
        {
          $group: {
            _id: {
              state_abbr: '$state_abbr',
              city: '$city',
              product: '$product',
            },
            max_date: {
              $max: {
                $toDate: {
                  $dateFromString: {
                    dateString: '$collection_date',
                    format: '%d/%m/%Y',
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            state_abbr: '$_id.state_abbr',
            city: '$_id.city',
            product: '$_id.product',
            max_date: {
              $dateToString: {
                date: '$max_date',
                format: '%d/%m/%Y',
              },
            },
          },
        },
      ])
      .exec();
  }

  getRanking(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.ranking) {
        errorReturn();
      }

      resolve(this.ranking);
    });
  }

  async getRankingMonth(city: string, state: string): Promise<Station[]> {
    if (!city || !state) {
      return errorReturn();
    }

    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

    return this.fuelModel
      .aggregate([
        {
          $addFields: {
            collection_date_iso: {
              $dateFromString: {
                dateString: '$collection_date',
                format: '%d/%m/%Y',
              },
            },
          },
        },
        {
          $match: {
            collection_date_iso: {
              $gte: thirtyOneDaysAgo,
              $lt: new Date(),
            },
            city: city,
            state_abbr: state,
          },
        },
        {
          $group: {
            _id: {
              city: '$city',
              state_abbr: '$state_abbr',
              product: '$product',
            },
            cheapest_resellers: {
              $push: {
                reseller_cnpj: '$reseller_cnpj',
                average_sale_value: {
                  $avg: {
                    $toDouble: '$sale_value',
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            city: '$_id.city',
            state_abbr: '$_id.state_abbr',
            product: '$_id.product',
            cheapest_resellers: {
              $slice: ['$cheapest_resellers', 10],
            },
          },
        },
        {
          $unwind: '$cheapest_resellers',
        },
        {
          $sort: {
            'cheapest_resellers.average_sale_value': 1,
          },
        },
        {
          $group: {
            _id: {
              city: '$city',
              state_abbr: '$state_abbr',
              product: '$product',
            },
            cheapest_resellers: {
              $push: '$cheapest_resellers',
            },
          },
        },
        {
          $group: {
            _id: {
              city: '$_id.city',
              state_abbr: '$_id.state_abbr',
            },
            products: {
              $push: {
                name: '$_id.product',
                cheapest_resellers: '$cheapest_resellers',
              },
            },
          },
        },
        {
          $sort: {
            '_id.state_abbr': 1,
            '_id.city': 1,
          },
        },
        {
          $group: {
            _id: null,
            cities: {
              $push: {
                city: '$_id.city',
                state_abbr: '$_id.state_abbr',
                products: '$products',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            cities: 1,
          },
        },
      ])
      .exec();
  }
}
