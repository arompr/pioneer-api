import { JwtService } from '@nestjs/jwt';
import type { JwtTokenPayload, JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';

type RawJwtPayload = {
    playerId: string;
    lobbyId: string;
};

/**
 * JWT implementation of JwtTokenService using @nestjs/jwt.
 */
export class JwtTokenServiceImpl implements JwtTokenService {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * Encodes a player and lobby identity into a JWT token with no expiration.
     *
     * @param {PlayerId} playerId - The player's unique identifier.
     * @param {LobbyId} lobbyId - The lobby's unique identifier.
     * @returns {string} A signed JWT token.
     */
    encode(playerId: PlayerId, lobbyId: LobbyId): string {
        const payload: RawJwtPayload = {
            playerId: playerId.value,
            lobbyId: lobbyId.value,
        };
        return this.jwtService.sign(payload);
    }

    /**
     * Decodes and verifies a JWT token, returning domain value objects.
     *
     * @param {string} token - The JWT token to decode.
     * @returns {JwtTokenPayload} The decoded payload as domain value objects.
     * @throws {JsonWebTokenError} if the token is invalid or tampered with.
     */
    decode(token: string): JwtTokenPayload {
        const raw = this.jwtService.verify<RawJwtPayload>(token);
        return {
            playerId: new PlayerId(raw.playerId),
            lobbyId: new LobbyId(raw.lobbyId),
        };
    }
}
