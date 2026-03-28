import { LobbyConfigWsResponse } from './LobbyConfigWsResponse';
import { PlayerWsResponse } from './PlayerWsResponse';

/** @publish */
export type LobbyWsResponse = {
    id: string;
    players: PlayerWsResponse[];
    config: LobbyConfigWsResponse;
    status: string;
};
