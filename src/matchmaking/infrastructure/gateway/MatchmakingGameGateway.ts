import { GameConfigId } from '#game/domain/config/GameConfigId';
import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { LobbyGameConfig } from '#matchmaking/domain/lobby/LobbyGameConfig';
import { GameConfigId as MatchmakingGameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';

/**
 * InProcess based implementation of IGameGateway.
 * Calls game slice usecases for configuration operations.
 * Enables clean separation and prepares for future microservices evolution.
 */
export class MatchmakingGameGateway implements IGameGateway {
    constructor(
        private readonly createGameConfigUseCase: CreateGameConfigUseCase,
        private readonly getGameConfigUseCase: GetGameConfigUseCase
    ) {}
    public async createConfig(gameModeString: string): Promise<{ configId: string }> {
        const result = await Promise.resolve(
            this.createGameConfigUseCase.execute({ gameMode: gameModeString })
        );
        return { configId: result.createdConfig.id.value };
    }

    public async getMatchmakingGameConfig(
        configId: MatchmakingGameConfigId
    ): Promise<LobbyGameConfig> {
        const result = await Promise.resolve(
            this.getGameConfigUseCase.execute(new GameConfigId(configId.value))
        );

        const { minPlayers, maxPlayers } = result.config;

        return new LobbyGameConfig(minPlayers, maxPlayers);
    }
}
