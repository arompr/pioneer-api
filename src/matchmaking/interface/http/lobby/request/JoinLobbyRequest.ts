import { IsNotEmpty, IsString } from 'class-validator';

export class JoinLobbyRequest {
    @IsNotEmpty()
    @IsString()
    playerName!: string;
}
