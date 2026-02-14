import { LobbyResponse } from './LobbyResponse';
import { PrivatePlayerResponse } from '../player/PrivatePlayerResponse';

export type CreateLobbyResponse = {
    lobby: LobbyResponse;
    selfPlayer: PrivatePlayerResponse;
};
