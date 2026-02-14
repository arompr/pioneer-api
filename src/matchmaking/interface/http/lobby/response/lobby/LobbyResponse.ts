import { LobbyConfigResponse } from './LobbyConfigResponse';
import { PlayerResponse } from '../player/PlayerResponse';

export class LobbyResponse {
    id!: string;
    players!: PlayerResponse[];
    config!: LobbyConfigResponse;
    status!: string;
}
