import { IsNotEmpty, IsString } from 'class-validator';

/** @publish */
export class CreateLobbyRequest {
    @IsNotEmpty()
    @IsString()
    hostName!: string;
}
