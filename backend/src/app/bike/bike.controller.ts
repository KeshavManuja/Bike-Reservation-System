import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BikeService, IFilterbike } from './bike.service';
import { RoleGuard } from '../../AuthGuards/RoleGuard';
import { Bike } from '../../entity/bike.entity';
import { JoiValidationPipe } from '../../joi.validation.pipe';
import { bikeSchema, getBikesSchema, patchBikeSchema } from './bike.schema';
import { AuthGuard } from '../../AuthGuards/AuthGuard';
import { User } from '../../entity/user.entity';
import { Auth } from '../../../util/Auth.Decorator';

@Controller('bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(new JoiValidationPipe(getBikesSchema))
  getBikes(@Query() query: any, @Auth() auth: { user: User; token: string }) {
    return this.bikeService.getBikes(query, auth);
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  getBike(@Param('id', ParseIntPipe) id: number) {
    return this.bikeService.getBike(id);
  }

  @UseGuards(RoleGuard)
  @Post('add')
  @UsePipes(new JoiValidationPipe(bikeSchema))
  addBike(@Body() { model, color, location, isAvailable }: Bike) {
    return this.bikeService.addBike({
      model,
      color,
      location,
      isAvailable,
    });
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  deleteBike(@Param('id', ParseIntPipe) id: number) {
    return this.bikeService.deleteBike(id);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  @UsePipes(new JoiValidationPipe(patchBikeSchema))
  updateBike(
    @Body() { model, location, rating, color, isAvailable }: Bike,
    @Param() { id }: { id: number },
  ) {
    return this.bikeService.updateBike({
      model,
      location,
      rating,
      color,
      isAvailable,
      id,
    });
  }
}
