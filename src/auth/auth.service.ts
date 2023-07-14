import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entity
import { User } from './user.entity';

// DTOs
import { AuthCredentialsDto } from './dtos';

// Bcrypt
import * as bcrypt from 'bcrypt';

import { JwtPayload } from './jwt/jwt-payload.interface';
// JWT
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>, private jwtService: JwtService) { }
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password } = authCredentialsDto;

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepo.create({
            username,
            password: hashedPassword,
        });

        await this.userRepo.save(user);

        return user;
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;

        const user = await this.userRepo.findOne({ where: { username } });

        if (user && await bcrypt.compare(password, user.password)) {
            const payload: JwtPayload = { username };

            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

    async deleteUserById(id: string): Promise<void> {
        await this.userRepo.delete(id);
    }
}
