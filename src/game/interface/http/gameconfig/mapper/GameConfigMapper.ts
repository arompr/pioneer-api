import { GameConfig } from '#game/domain/config/GameConfig';
import type { GameConfigResponse } from '../response/GameConfigResponse';

export class GameConfigMapper {
    static toGameConfigResponse(gameConfig: GameConfig): GameConfigResponse {
        return {
            id: gameConfig.gameConfigId.value,
            gameMode: gameConfig.gameMode,
            minPlayers: gameConfig.minPlayers,
            maxPlayers: gameConfig.maxPlayers,
        };
    }
}
