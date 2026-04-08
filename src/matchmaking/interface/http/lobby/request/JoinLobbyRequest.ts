import { IsNotEmpty, IsString } from 'class-validator';

/** @publish */
export class JoinLobbyRequest {
    @IsNotEmpty()
    @IsString()
    playerName!: string;
}
