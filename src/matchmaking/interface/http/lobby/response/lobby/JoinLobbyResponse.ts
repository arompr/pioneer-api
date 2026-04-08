import { LobbyResponse } from './LobbyResponse';
import { PrivatePlayerResponse } from '../player/PrivatePlayerResponse';

/** @publish */
export type JoinLobbyResponse = {
    lobby: LobbyResponse;
    selfPlayer: PrivatePlayerResponse;
};
