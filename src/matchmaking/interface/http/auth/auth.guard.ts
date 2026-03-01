import { JWT_TOKEN_SERVICE, type JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from './AuthenticatedRequest';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@Inject(JWT_TOKEN_SERVICE) private jwtService: JwtTokenService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = this.jwtService.decode(token);

            request.playerId = payload.playerId;
            request.lobbyId = payload.lobbyId;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: AuthenticatedRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
