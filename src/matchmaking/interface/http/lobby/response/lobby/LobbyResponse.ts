import { LobbyConfigResponse } from './LobbyConfigResponse';
import { PlayerResponse } from '../player/PlayerResponse';

export type LobbyResponse = {
    id: string;
    players: PlayerResponse[];
    config: LobbyConfigResponse;
    status: string;
};
