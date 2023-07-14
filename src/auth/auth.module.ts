import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

// JWT
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt';

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" }),
  JwtModule.register({
    secret: "topSecret",
    signOptions: {
      expiresIn: 3600,
    }
  }),
  TypeOrmModule.forFeature([User])],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
