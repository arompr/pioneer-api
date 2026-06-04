import { IsNotEmpty, IsString } from 'class-validator';

/** @publish */
export class CreateGameConfigRequest {
    @IsNotEmpty()
    @IsString()
    gameMode!: string;
}
