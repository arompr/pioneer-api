import type { PlayerId } from '#common/domain/player/playerId/PlayerId';
import type { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';

export type JwtTokenPayload = {
    playerId: PlayerId;
    lobbyId: LobbyId;
};

export const JWT_TOKEN_SERVICE = Symbol('JwtTokenService');

/**
 * Domain service interface for encoding and decoding JWT tokens.
 */
export interface JwtTokenService {
    /**
     * Encodes a player and lobby identity into a JWT token.
     *
     * @param {PlayerId} playerId - The player's unique identifier.
     * @param {LobbyId} lobbyId - The lobby's unique identifier.
     * @returns {string} A signed JWT token.
     */
    encode(playerId: PlayerId, lobbyId: LobbyId): string;

    /**
     * Decodes and verifies a JWT token, returning the payload.
     *
     * @param {string} token - The JWT token to decode.
     * @returns {JwtTokenPayload} The decoded payload containing playerId and lobbyId.
     * @throws if the token is invalid or tampered with.
     */
    decode(token: string): JwtTokenPayload;
}
