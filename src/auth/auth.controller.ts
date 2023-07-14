import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// DTOs
import { AuthCredentialsDto } from './dtos';
import { User } from './user.entity';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return await this.authService.createUser(authCredentialsDto);
    }

    @Post('/signin')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return await this.authService.signin(authCredentialsDto);
    }

    @Delete('/:id')
    async deleteUserById(@Param('id') id: string): Promise<void> {
        await this.authService.deleteUserById(id);
    }
}
