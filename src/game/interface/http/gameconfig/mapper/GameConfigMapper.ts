import { GameConfig } from '#game/domain/config/GameConfig';
import type { GameConfigResponse } from '../response/GameConfigResponse';

export class GameConfigMapper {
    static toGameConfigResponse(gameConfig: GameConfig): GameConfigResponse {
        return {
            id: gameConfig.id.value,
            gameMode: gameConfig.gameMode,
            minPlayers: gameConfig.minPlayers,
            maxPlayers: gameConfig.maxPlayers,
        };
    }
}
