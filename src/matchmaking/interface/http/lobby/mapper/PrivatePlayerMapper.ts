import { CreatePlayerDto } from '#matchmaking/usecase/dto/CreatePlayerDto';
import { PrivatePlayerResponse } from '../response/player/PrivatePlayerResponse';

export class PrivatePlayerMapper {
    static toPlayerResponse(player: CreatePlayerDto, isHost: boolean): PrivatePlayerResponse {
        return {
            id: player.id.value,
            token: player.rawToken.value,
            name: player.name,
            isHost: isHost,
        };
    }
}
