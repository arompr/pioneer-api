import { LobbyResponse } from './LobbyResponse';
import { PlayerResponse } from '../player/PlayerResponse';

export class CreateLobbyResponse {
    lobby!: LobbyResponse;
    selfPlayer!: PlayerResponse;
}
