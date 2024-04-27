import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingModule } from './ranking/ranking.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelModule } from './fuel/fuel.module';

@Module({
  imports: [
    RankingModule,
    MongooseModule.forRoot(
      'mongodb+srv://i6r1WJw2IDAMcdtZ1D2aHk:f5r71ivyel3frw7McO9tygKxp38UB5Wh@samypo.bqlnpeh.mongodb.net/samypo',
      {
        serverApi: { version: '1', strict: true, deprecationErrors: true },
      },
    ),
    FuelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
