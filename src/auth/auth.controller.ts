import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @UseGuards(LocalGuard)
    login(@Req() req: Request) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
        return {
            message: 'Ruta protegida',
            user: req.user,
        };
    }
}
