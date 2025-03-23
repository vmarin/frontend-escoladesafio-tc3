import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/services/users.service';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private usersService;
    constructor(jwtService: JwtService, reflector: Reflector, usersService: UsersService);
    private extractTokenFromHeader;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
