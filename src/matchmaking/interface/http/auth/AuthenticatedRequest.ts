import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { Request } from 'express';

/** @publish */
export interface AuthenticatedRequest extends Request {
    playerId: PlayerId;
    lobbyId: LobbyId;
}
