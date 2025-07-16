import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment) private readonly appointmentRepo: Repository<Appointment>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    async getAvailableSlots(date: string) {
        const startHour = 16;
        const endHour = 21;
        const allSlots = [];

        for (let hour = startHour; hour < endHour; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            allSlots.push(time);
        }

        const existing = await this.appointmentRepo.find({where: { date },});

        const takenTimes = existing.map(a => a.time);
        const available = allSlots.map(time => ({
            time,
            available: !takenTimes.includes(time),
        }));

        return available;
    }

    async reserveSlot(date: string, time: string, userId: number) {
        const existing = await this.appointmentRepo.findOne({ where: { date, time } });
        if (existing) throw new BadRequestException('Ese turno ya está reservado');

        const user = await this.userRepo.findOne({ where: { id: userId } });

        const appointment = this.appointmentRepo.create({ date, time, user });
        return this.appointmentRepo.save(appointment);
    }

    async getUserAppointments(userId: number) {
        const today = new Date().toISOString().split('T')[0];
    
        return this.appointmentRepo
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.user', 'user')
            .where('appointment.userId = :userId', { userId })
            .andWhere('appointment.date >= :today', { today })
            .orderBy('appointment.date', 'ASC')
            .addOrderBy('appointment.time', 'ASC')
            .getMany();
    }

    async cancelAppointment(id: number, userId: number) {
    const appointment = await this.appointmentRepo.findOne({
        where: { id },
        relations: ['user'],
    });

    if (!appointment || appointment.user.id !== userId) {
        throw new BadRequestException('No autorizado o turno inexistente');
    }

    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();

    const diffMs = appointmentDate.getTime() - now.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 24) {
        throw new BadRequestException('Solo se puede cancelar con más de 24hs de anticipación');
    }

    await this.appointmentRepo.delete(id);
    return { message: 'Turno cancelado correctamente' };
    }   
}
