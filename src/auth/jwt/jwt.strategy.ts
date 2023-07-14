import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {
        super({
            secretOrKey: "topSecret",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: { username: string }) {
        const { username } = payload;

        const user = await this.userRepo.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}