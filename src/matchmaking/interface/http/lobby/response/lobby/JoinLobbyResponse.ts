import { LobbyResponse } from './LobbyResponse';
import { PrivatePlayerResponse } from '../player/PrivatePlayerResponse';

export type JoinLobbyResponse = {
    lobby: LobbyResponse;
    selfPlayer: PrivatePlayerResponse;
};
