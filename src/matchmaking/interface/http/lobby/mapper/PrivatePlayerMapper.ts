import { Player } from '#matchmaking/domain/player/Player';
import { PrivatePlayerResponse } from '../response/player/PrivatePlayerResponse';

export class PrivatePlayerMapper {
    static toPlayerResponse(player: Player, isHost: boolean): PrivatePlayerResponse {
        return {
            secretKey: player.id.toString(),
            publicKey: player.publicKey.toString(),
            name: player.name,
            isHost: isHost,
        };
    }
}
