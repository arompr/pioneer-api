import { CreateGameConfigUseCase } from '#game/usecase/CreateGameConfigUseCase';
import { GetGameConfigUseCase } from '#game/usecase/GetGameConfigUseCase';
import { GAME_GATEWAY, IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { MatchmakingGameGateway } from '#matchmaking/infrastructure/gateway/MatchmakingGameGateway';
import { Provider } from '@nestjs/common';

export const gatewayProviders: Provider[] = [
    {
        provide: GAME_GATEWAY,
        useFactory: (
            createGameConfigUseCase: CreateGameConfigUseCase,
            getGameConfigUseCase: GetGameConfigUseCase
        ): IGameGateway =>
            new MatchmakingGameGateway(createGameConfigUseCase, getGameConfigUseCase),
        inject: [CreateGameConfigUseCase, GetGameConfigUseCase],
    },
];
