import { Player } from '#matchmaking/domain/player/Player';
import { PrivatePlayerResponse } from '../response/player/PrivatePlayerResponse';

export class PrivatePlayerMapper {
    static toPlayerResponse(player: Player, isHost: boolean, token: string): PrivatePlayerResponse {
        return {
            token,
            id: player.id.value,
            name: player.name,
            isHost,
        };
    }
}
