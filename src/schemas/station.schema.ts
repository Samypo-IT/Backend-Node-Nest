import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StationDocument = HydratedDocument<Station>;

@Schema()
export class Station {
  @Prop()
  product: string;

  @Prop()
  region_abbr: string;

  @Prop()
  state_abbr: string;

  @Prop()
  city: string;

  @Prop()
  reseller: string;

  @Prop()
  reseller_cnpj: string;

  @Prop()
  street_name: string;

  @Prop()
  street_number: string;

  @Prop()
  complement: string;

  @Prop()
  neighborhood: string;

  @Prop()
  zip_code: string;

  @Prop()
  collection_date: string;

  @Prop()
  sale_value: string;

  @Prop()
  purchase_value: string;

  @Prop()
  unit_of_measure: string;

  @Prop()
  brand: string;

  @Prop({ default: 0 })
  __v: number;
}

export const StationSchema = SchemaFactory.createForClass(Station).index(
  { reseller_cnpj: 1, collection_date: 1, product: 1 },
  { unique: true },
);
