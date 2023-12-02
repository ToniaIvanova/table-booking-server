import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './booking.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'booking', schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [
    BookingService,
    MongooseModule.forFeature([{ name: 'booking', schema: BookingSchema }]),
  ],
})
export class BookingModule {}
