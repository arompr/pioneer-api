import { LobbyGameMode } from '#matchmaking/domain/lobby/LobbyConfig/LobbyGameMode';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

/** @publish */
export class CreateLobbyRequest {
    @IsNotEmpty()
    @IsString()
    hostName!: string;

    @IsEnum(LobbyGameMode)
    gameMode!: LobbyGameMode;
}
