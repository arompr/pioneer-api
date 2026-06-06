import { GameConfigId } from '#game/domain/config/GameConfigId';
import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { GameConfigId as MatchmakingGameConfigId } from '#matchmaking/domain/gameConfig/GameConfigId';
import type { IGameGateway, MatchmakingGameConfig } from '#matchmaking/domain/gateway/GameGateway';

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

    public async validatePlayerCount(configId: string, currentPlayers: number): Promise<boolean> {
        const result = await Promise.resolve(
            this.getGameConfigUseCase.execute(new GameConfigId(configId))
        );

        const { minPlayers, maxPlayers } = result.config;

        if (currentPlayers < minPlayers) {
            throw new Error(`Player count ${currentPlayers} is below minimum ${minPlayers}`);
        }

        if (currentPlayers > maxPlayers) {
            throw new Error(`Player count ${currentPlayers} exceeds maximum ${maxPlayers}`);
        }

        return true;
    }

    public async getMatchmakingGameConfig(
        configId: MatchmakingGameConfigId
    ): Promise<MatchmakingGameConfig> {
        const result = await Promise.resolve(
            this.getGameConfigUseCase.execute(new GameConfigId(configId.value))
        );

        const { minPlayers, maxPlayers } = result.config;

        return { minPlayers, maxPlayers };
    }
}
