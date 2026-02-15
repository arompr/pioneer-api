import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveLobbyRequest {
    @IsNotEmpty()
    @IsString()
    secretKey!: string;
}
