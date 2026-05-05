import { PlayerResponse } from '../player/PlayerResponse';

/** @publish */
export type LobbyResponse = {
    id: string;
    players: PlayerResponse[];
    gameConfigId: string | undefined;
    status: string;
};
