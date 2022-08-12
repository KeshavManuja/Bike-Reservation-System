import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { RoleGuard } from '../../AuthGuards/RoleGuard';
import { IBikeToReserve, IRating } from './reservation.service';
import { AuthGuard } from '../../AuthGuards/AuthGuard';
import { JoiValidationPipe } from '../../joi.validation.pipe';
import { AddRatingSchema, BookReservationSchema } from './reservation.schema';
import { Auth } from '../../../util/Auth.Decorator';
import { User } from '../../entity/user.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard)
  @Post('reservebike')
  @UsePipes(new JoiValidationPipe(BookReservationSchema))
  async reserveBikeforUser(@Body() resbike: IBikeToReserve, @Auth() auth:{user:User}) {
    return this.reservationService.reserveBikeforUser({ resbike });
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  async allBikesReservedByUser(@Param('id', ParseIntPipe) id: number, @Auth() auth: {user:User, token:string}) {
    return this.reservationService.getUserReservations(id,auth);
  }
  @UseGuards(RoleGuard)
  @Get('bike/:id')
  async allUsersReservedaBike(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.getUsersforBike(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async cancelReservation(@Param('id', ParseIntPipe) id: number, @Auth() auth:{user:User, token: string}) {
    return this.reservationService.cancelReservation(id,auth);
  }

  @UseGuards(AuthGuard)
  @Post('rating')
  @UsePipes(new JoiValidationPipe(AddRatingSchema))
  async addRating(@Body() body: IRating, @Auth() auth:{user:User, token: string}) {
    return this.reservationService.addRating(body,auth);
  }
}
