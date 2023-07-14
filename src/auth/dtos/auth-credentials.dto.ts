import { IsNotEmpty, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class AuthCredentialsDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}