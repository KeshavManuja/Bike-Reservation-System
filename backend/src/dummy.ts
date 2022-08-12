import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from '../src/entity/user.entity';
import * as Bcryptjs from 'bcryptjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { faker } from '@faker-js/faker';
import { Reservation } from './entity/reservation.entity';
import { Bike } from './entity/bike.entity';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  await Reservation.delete({});
  await User.delete({});
  await Bike.delete({});
  await seedUsers();
  await seedBikes();
  await seedReservations();
  await app.close();
};

const seedUsers = async () => {
  const users = [];
  const role = ['manager', 'regular'];
  for (let i = 0; i < 10; i++) {
    const u = new User();
    u.name = faker.name.findName().toLowerCase();
    u.password = Bcryptjs.hashSync('1234', 10);
    u.role = i % 3 === 0 ? role[0] : role[1];
    u.email = faker.internet.email().toLowerCase();
    users.push(u);
  }
  await User.save(users);
};

const seedBikes = async () => {
  const bikes = [];
  for (let i = 0; i < 50; i++) {
    const bike = new Bike();
    bike.model = _.sample(['Model X', 'Model Y', 'Model Z']);
    bike.color = faker.color.human();
    bike.location = faker.address.city();
    bike.isAvailable = Math.random() < 0.7;
    bikes.push(bike);
  }
  await Bike.save(bikes);
};

const seedReservations = async () => {
  const users = await User.find({});
  const bikes = await Bike.find({});
  const reservations = [];
  for (let i = 0; i < 50; i++) {
    const randHour = parseInt(String(Math.random() * 200));
    const r = new Reservation();
    r.bike = _.sample(bikes);
    r.user = _.sample(users);
    r.fromDate = moment().subtract(randHour, 'hour').toDate();
    r.toDate = moment().add(randHour, 'hour').toDate();
    r.status = Math.random() > 0.7 ? 'Cancel' : 'Active';
    reservations.push(r);
  }
  await Reservation.save(reservations);
};

bootstrap().then();
