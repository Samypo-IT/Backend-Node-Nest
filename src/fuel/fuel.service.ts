import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fuel, FuelDocument } from '../schemas/fuel.schema';

@Injectable()
export class FuelService {
  constructor(@InjectModel(Fuel.name) private fuelModel: Model<FuelDocument>) {}

  async create(createFuelDto: Partial<Fuel>): Promise<Fuel> {
    const createdFuel = new this.fuelModel(createFuelDto);
    return createdFuel.save();
  }

  async findAll(page = 1, limit = 20): Promise<Fuel[]> {
    const skip = (page - 1) * limit;
    return this.fuelModel.find().skip(skip).limit(limit).exec();
  }
}
