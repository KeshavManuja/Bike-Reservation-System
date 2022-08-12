import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Reservation } from '../../entity/reservation.entity';
import { Bike } from '../../entity/bike.entity';
import { User } from '../../entity/user.entity';

export interface IBikeToReserve {
  bikeId: number;
  fromDate: Date;
  toDate: Date;
  status: string;
  userId: number;
  rating: number;
  hasRated: boolean;
}

export interface IRating {
  id: number;
  rating: number;
  userID: string;
}

@Injectable()
export class ReservationService {
  constructor() {}

  async getUserReservations(
    id: number,
    auth: { user: User; token: string },
  ): Promise<Reservation[]> {
    if (auth.user.role !== 'manager' && id !== auth.user.id) {
      throw new HttpException(
        'Can not see other user reservations',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await User.findOne({
      where: { id },
    });

    if (!user)
      throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
    const allReservations = await Reservation.find({
      relations: ['user', 'bike'],
      where: {
        user: {
          id: user.id,
        },
      },
      order: { id: 'DESC' },
    });

    return allReservations;
  }

  async reserveBikeforUser({ resbike }: { resbike: IBikeToReserve }) {
    const bike = await Bike.findOneBy({ id: resbike.bikeId });
    if (!bike) {
      throw new HttpException('Bike not found', HttpStatus.BAD_REQUEST);
    }
    resbike.toDate = new Date(resbike.toDate);
    resbike.fromDate = new Date(resbike.fromDate);

    if (!bike.isAvailable) {
      throw new HttpException('Bike not available', HttpStatus.BAD_REQUEST);
    }

    const reservedBikeIds = await this.checkBikeAvailablity({
      toDate: resbike.toDate,
      fromDate: resbike.fromDate,
    });

    if (reservedBikeIds.includes(resbike.bikeId)) {
      throw new HttpException('Bike is already booked', HttpStatus.BAD_REQUEST);
    }
    const user = await User.findOneBy({ id: resbike.userId });
    const newresbike = Reservation.create({
      ...resbike,
      bike: bike,
      user: user,
    });

    return Reservation.save(newresbike);
  }

  async checkBikeAvailablity({
    toDate,
    fromDate,
  }: {
    toDate: Date;
    fromDate: Date;
  }): Promise<number[]> {
    if (new Date(toDate) < new Date(fromDate)) {
      throw new HttpException(
        'starting date can not be less than end date',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bikeAvailableForGivenTimeSlots = await Reservation.find({
      loadRelationIds: true,
      where: [
        {
          toDate: Between(new Date(fromDate), new Date(toDate)),
        },
        {
          fromDate: LessThanOrEqual(new Date(fromDate)),
          toDate: MoreThanOrEqual(new Date(toDate)),
        },
        {
          fromDate: Between(new Date(fromDate), new Date(toDate)),
        },
      ],
      select: ['bike'],
    });

    return bikeAvailableForGivenTimeSlots.map((id) => {
      return +id.bike;
    });
  }

  async getUsersforBike(id: number) {
    const avlBike = await Bike.findOneBy({ id });

    if (!avlBike) {
      throw new HttpException('Bike is not found', HttpStatus.BAD_REQUEST);
    }

    const allReservations = await Reservation.find({
      relations: ['user', 'bike'],
      where: {
        bike: {
          id: avlBike.id,
        },
      },
    });

    return allReservations;
  }

  async cancelReservation(id: number, auth: { user: User; token: string }) {
    const reservation = await Reservation.findOne({
      relations: ['user'],
      where: { id },
    });
    if (!reservation) {
      throw new HttpException(
        'Invalid Reservation Cancel request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (reservation.user.id !== auth.user.id) {
      throw new UnauthorizedException(
        'Not authorsied to cancel other user reservations',
      );
    }
    if (reservation.status !== 'Active') {
      throw new HttpException(
        'Reservation already cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (reservation.hasRated) {
      throw new HttpException(
        'Reservation already Rated',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await Reservation.save({
      ...reservation,
      status: 'Cancel',
      toDate: '',
      fromDate: '',
    });
  }

  async addRating(body: IRating, auth: { user: User; token: string }) {
    if (+body.userID !== auth.user.id) {
      throw new UnauthorizedException('Can not alter other user Reservation');
    }
    const { rating, id } = body;
    const reservation = await Reservation.findOne({
      relations: ['bike'],
      where: { id },
    });

    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }
    if (reservation.status === 'Cancel') {
      throw new HttpException(
        'Reservation already cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bike = await Bike.findOneBy({
      id: reservation.bike.id,
    });
    if (!bike) {
      throw new HttpException('Reservation not found', HttpStatus.BAD_REQUEST);
    }

    if (reservation.hasRated) {
      throw new HttpException('Rated already', HttpStatus.BAD_REQUEST);
    }

    reservation.hasRated = true;
    reservation.rating = rating;

    await Reservation.save(reservation);

    const count = await Reservation.count({
      relations: ['bike'],
      where: {
        bike: {
          id: bike.id,
        },
        hasRated: true,
      },
    });

    const newRating = (+bike.rating * (count - 1) + +rating) / +count;
    bike.rating = newRating;
    await Bike.save(bike);

    return { message: 'success' };
  }
}
