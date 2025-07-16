import { IsDateString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString({}, { message: 'La fecha debe estar en formato YYYY-MM-DD' })
  date: string;

  @Matches(/^([0-1][0-9]|2[0-3]):00$/, {
    message: 'La hora debe estar en formato HH:00 entre 00 y 23',
  })
  time: string;
}
