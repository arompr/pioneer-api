import { LobbyResponse } from './LobbyResponse';
import { PrivatePlayerResponse } from '../player/PrivatePlayerResponse';

/** @publish */
export type CreateLobbyResponse = {
    lobby: LobbyResponse;
    selfPlayer: PrivatePlayerResponse;
};
