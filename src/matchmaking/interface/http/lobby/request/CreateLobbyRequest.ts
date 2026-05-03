import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/** @publish */
export class CreateLobbyRequest {
    @IsNotEmpty()
    @IsString()
    hostName!: string;

    @IsOptional()
    @IsString()
    gameConfigId?: string;
}
