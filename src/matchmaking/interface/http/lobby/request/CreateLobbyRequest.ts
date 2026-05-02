import { GameMode } from '#game/domain/config/GameMode';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

/** @publish */
export class CreateLobbyRequest {
    @IsNotEmpty()
    @IsString()
    hostName!: string;

    @IsEnum(GameMode)
    gameMode!: GameMode;

    @IsOptional()
    @IsString()
    gameConfigId?: string;
}
