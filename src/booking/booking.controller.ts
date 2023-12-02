import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from './interfaces/booking.interface';
import { AddBooking } from './dto/add.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async getAll(): Promise<Booking[]> {
    return this.bookingService.getAll();
  }

  @Post()
  async addBooking(@Body() body: AddBooking): Promise<Booking> {
    return this.bookingService.add(body);
  }
}
