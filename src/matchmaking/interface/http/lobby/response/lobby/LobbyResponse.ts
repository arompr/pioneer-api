import { LobbyConfigResponse } from './LobbyConfigResponse';
import { PlayerResponse } from '../player/PlayerResponse';

/** @publish */
export type LobbyResponse = {
    id: string;
    players: PlayerResponse[];
    config: LobbyConfigResponse;
    status: string;
};
