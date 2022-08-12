import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Bike } from '../../entity/bike.entity';

import { In, Not } from 'typeorm';
import { ReservationService } from '../reservation/reservation.service';
import { User } from 'src/entity/user.entity';
import * as moment from 'moment';
import { bikeSchema, getBikesSchema, patchBikeSchema } from './bike.schema';

export interface IBike {
  id?: number;
  model: string;
  color: string;
  location: string;
  rating: string;
  isAvailable: boolean;
}

export interface IFilterbike {
  model?: string;
  color?: string;
  location?: string;
  fromDate?: Date;
  toDate?: Date;
  rating?: string;
  isAvailable: boolean;
  page?: number;
  limit?: number;
}

export interface IFilterResponse {
  bikes: Bike[];
  pages: number;
}

@Injectable()
export class BikeService {
  static updateBikeRating(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private reservationService: ReservationService) {}

  async getBikes(
    query: IFilterbike,
    auth: { user: User; token: string },
  ): Promise<IFilterResponse> {
    const { error, value } = getBikesSchema.validate(query);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    else {
      const { page, limit, fromDate, toDate, isAvailable, ...rest } = value;
      if (auth.user.role === 'regular') {
        if (`${isAvailable}` === 'false') {
          throw new HttpException(
            'Unauthorised for regular user',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (!page || page < 1 || !limit || limit < 1) {
        throw new HttpException('Invalid page count', HttpStatus.BAD_REQUEST);
      }

      const obj = {};
      for (const keys in rest) {
        if (rest[keys]) {
          obj[keys] = rest[keys];
        }
      }

      if (fromDate && toDate) {
        const fromDateMoment = new Date(fromDate);
        const toDateMoment = new Date(toDate);
        if (fromDateMoment > toDateMoment) {
          throw new HttpException(
            'Start Date can not be greater the end date',
            HttpStatus.BAD_REQUEST,
          );
        }
        const reservedBikeIDsforGivenTime =
          await this.reservationService.checkBikeAvailablity({
            fromDate,
            toDate,
          });

        const bikes = await Bike.find({
          where: {
            id: Not(In(reservedBikeIDsforGivenTime)),
            isAvailable: `${isAvailable}` === 'true',
            ...obj,
          },
          take: limit,
          skip: (page - 1) * limit,
          order: { id: 'DESC' },
        });

        const count = await Bike.count({
          where: {
            id: Not(In(reservedBikeIDsforGivenTime)),
            isAvailable: `${isAvailable}` === 'true',
            ...obj,
          },
        });

        return { bikes: bikes, pages: Math.ceil(count / limit) };
      } else {
        const bikes = await Bike.find({
          where: { isAvailable: `${isAvailable}` === 'true', ...obj },
          take: limit,
          skip: (page - 1) * limit,
          order: { id: 'DESC' },
        });

        const count = await Bike.count({
          where: { isAvailable: `${isAvailable}` === 'true', ...obj },
        });

        return { bikes: bikes, pages: Math.ceil(count / limit) };
      }
    }
  }

  async deleteBike(id: number): Promise<void> {
    const bike = await Bike.findOneBy({ id });
    if (!bike) {
      throw new HttpException('Bike Id is wrong', HttpStatus.BAD_REQUEST);
    }
    await Bike.delete({ id });
  }

  async addBike(param:{ model, color, location, isAvailable }) {
    const { error, value } = bikeSchema.validate(param);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    else {
      const newBike = Bike.create(value);
      return Bike.save(newBike);
    }
    
  }

  async getBike(id: number): Promise<Bike> {
    const bike = await Bike.findOneBy({ id });
    if (!bike) {
      throw new HttpException('bike not found', HttpStatus.BAD_REQUEST);
    }
    return bike;
  }

  async updateBike(param: {
    model: string;
    color: string;
    rating: number;
    location: string;
    id: number;
    isAvailable: boolean;
  }) {
    const { error, value } = patchBikeSchema.validate(param);
    if (error) throw new HttpException(error.message, 400);
    else {
      const { id, model, color, location, isAvailable, rating } = value;
      const bike = await Bike.findOneBy({ id });
      if (!bike) {
        throw new HttpException('bike not found', 400);
      }

      bike.model = model;
      bike.color = color;
      bike.location = location;
      bike.isAvailable = isAvailable;

      const updatedBike = await Bike.save(bike);
      return {
        id: updatedBike.id,
        model: updatedBike.model,
        location: updatedBike.location,
        isAvailable: updatedBike.isAvailable,
        rating,
      };
    }
  }
}
