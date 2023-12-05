import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './booking.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'booking', schema: BookingSchema }]),
    UserModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [
    BookingService,
    MongooseModule.forFeature([{ name: 'booking', schema: BookingSchema }]),
  ],
})
export class BookingModule {}
