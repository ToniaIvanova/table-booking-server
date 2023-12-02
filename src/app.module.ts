import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from './env.module';
import { UserModule } from './user/user.module';
import { BookingModule } from './booking/booking.module';
const { DB_URI } = process.env;

@Module({
  imports: [
    EnvModule,
    MongooseModule.forRoot(DB_URI),
    UserModule,
    BookingModule,
  ],
})
export class AppModule {}
