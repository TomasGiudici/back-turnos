import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Param, Delete } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentService: AppointmentsService) {}

    @Get('available')
    async getAvailable(@Query('date') date: string) {
        return this.appointmentService.getAvailableSlots(date);
    }

    @Post()
    async reserve(@Body() dto: CreateAppointmentDto, @Req() req) {
        return this.appointmentService.reserveSlot(dto.date, dto.time, req.user.id);
    }

    @Get('my')
    async getMyAppointments(@Req() req) {
        return this.appointmentService.getUserAppointments(req.user.id);
    }

    @Delete(':id')
    async cancel(@Param('id') id: number, @Req() req) {
        return this.appointmentService.cancelAppointment(id, req.user.id);
    }
}
