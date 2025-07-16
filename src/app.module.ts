import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Appointment],
      synchronize: true,
    }),
    AuthModule,
    AppointmentsModule,
  ],
})
export class AppModule {}