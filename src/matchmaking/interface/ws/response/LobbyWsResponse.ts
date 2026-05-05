import { PlayerWsResponse } from './PlayerWsResponse';

/** @publish */
export type LobbyWsResponse = {
    id: string;
    players: PlayerWsResponse[];
    gameConfigId: string | undefined;
    status: string;
};
