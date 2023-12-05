import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './interfaces/booking.interface';
import { AddBooking } from './dto/add.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('booking')
    private readonly bookingModel: Model<Booking>,
  ) {}

  async getAll(): Promise<Booking[]> {
    return this.bookingModel
      .find({ start: { $gt: new Date() } })
      .sort({ start: 1 })
      .exec();
  }

  async add({ start, userId }: AddBooking): Promise<Booking> {
    const threeHoursBefore = new Date(start);
    threeHoursBefore.setHours(threeHoursBefore.getHours() - 3);

    const threeHoursAfter = new Date(start);
    threeHoursAfter.setHours(threeHoursAfter.getHours() + 3);

    const alreadyBookedTime = await this.bookingModel.find({
      start: { $gte: threeHoursBefore, $lt: threeHoursAfter },
    });
    if (alreadyBookedTime.length) {
      throw new BadRequestException({
        message: 'Sorry, the table is booked for this time',
      });
    }

    const existedBooking = await this.bookingModel.findOne({ start });
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

      return await this.bookingModel.findOne({ start });
    } else {
      return await this.bookingModel.create({
        start,
        userFirst: userId,
        userSecond: null,
      });
    }
  }
}
