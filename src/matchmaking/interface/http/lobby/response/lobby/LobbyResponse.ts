import { PlayerResponse } from '../player/PlayerResponse';

/** @publish */
export type LobbyResponse = {
    id: string;
    players: PlayerResponse[];
    gameConfigId: string;
    status: string;
};
