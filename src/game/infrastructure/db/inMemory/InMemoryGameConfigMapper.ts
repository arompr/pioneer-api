import { GameConfig } from '#game/domain/config/GameConfig';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { gameModeFromString } from '#game/domain/config/GameMode';
import { InMemoryGameConfig } from './InMemoryGameConfig';

export function toInMemory(gameConfig: GameConfig): InMemoryGameConfig {
    return {
        id: gameConfig.id.value,
        gameMode: gameConfig.gameMode,
        minPlayers: gameConfig.minPlayers,
        maxPlayers: gameConfig.maxPlayers,
    };
}

export function toGameConfig(inMemoryGameConfig: InMemoryGameConfig): GameConfig {
    return new GameConfig(
        new GameConfigId(inMemoryGameConfig.id),
        gameModeFromString(inMemoryGameConfig.gameMode),
        inMemoryGameConfig.minPlayers,
        inMemoryGameConfig.maxPlayers
    );
}
