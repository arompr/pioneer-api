import { LobbyConfigWsResponse } from './LobbyConfigWsResponse';
import { PlayerWsResponse } from './PlayerWsResponse';

export type LobbyWsResponse = {
    id: string;
    players: PlayerWsResponse[];
    config: LobbyConfigWsResponse;
    status: string;
};
