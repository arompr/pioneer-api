import { IsNotEmpty, IsString } from 'class-validator';

/** @publish */
export class CreateDefaultGameConfigRequest {
    @IsNotEmpty()
    @IsString()
    gameMode!: string;
}
