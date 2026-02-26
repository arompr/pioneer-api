import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_TOKEN_SERVICE } from '#matchmaking/domain/auth/JwtTokenService';
import { JwtTokenServiceImpl } from '#matchmaking/infrastructure/auth/JwtTokenServiceImpl';

export const authProviders: Provider[] = [
    {
        provide: JWT_TOKEN_SERVICE,
        useFactory: (jwtService: JwtService) => new JwtTokenServiceImpl(jwtService),
        inject: [JwtService],
    },
];
