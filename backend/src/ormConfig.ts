import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Bike } from '../src/entity/bike.entity';
import { Reservation } from '../src/entity/reservation.entity';
import { User } from '../src/entity/user.entity';

const config: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.db',
  entities: [User, Bike, Reservation],
  synchronize: true,
};

export default config;
