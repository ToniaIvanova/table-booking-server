import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './interfaces/booking.interface';
import { AddBooking } from './dto/add.dto';
import { UserService } from 'src/user/user.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('booking')
    private readonly bookingModel: Model<Booking>,
    private readonly userService: UserService,
  ) {}

  async getAll(): Promise<Booking[]> {
    return this.bookingModel
      .find({ start: { $gt: new Date() } })
      .sort({ start: 1 })
      .exec();
  }

  async add({ start, userId }: AddBooking): Promise<Booking> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
      });
    }

    const startUTC = dayjs(start).utc().toDate();
    const threeHoursBefore = new Date(startUTC);
    threeHoursBefore.setHours(threeHoursBefore.getHours() - 3);

    const threeHoursAfter = new Date(startUTC);
    threeHoursAfter.setHours(threeHoursAfter.getHours() + 3);

    const alreadyBookedTime = await this.bookingModel.find({
      start: { $gte: threeHoursBefore, $lt: threeHoursAfter, $ne: startUTC },
    });

    if (
      alreadyBookedTime.length > 1 ||
      (alreadyBookedTime.length === 1 &&
        alreadyBookedTime[0].start !== startUTC)
    ) {
      throw new BadRequestException({
        message: 'Sorry, the table is booked for this time',
      });
    }

    const existedBooking = await this.bookingModel.findOne({ start: startUTC });
    if (
      existedBooking &&
      (existedBooking.userSecond ||
        existedBooking.userFirst?.toString() === userId)
    ) {
      throw new BadRequestException({ message: 'Wrong booking data' });
    }

    if (existedBooking) {
      await this.bookingModel.updateOne(
        { _id: existedBooking._id },
        {
          userSecond: userId,
        },
      );

      return await this.bookingModel.findOne({ start: startUTC });
    } else {
      return await this.bookingModel.create({
        start: startUTC,
        userFirst: user._id,
        userSecond: null,
      });
    }
  }
}
