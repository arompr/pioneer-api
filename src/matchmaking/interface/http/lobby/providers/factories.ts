import { Provider } from '@nestjs/common';
import { LobbyConfigFactory } from '#matchmaking/domain/lobby/LobbyConfig/LobbyConfigFactory';
import { LobbyFactory } from '#matchmaking/domain/lobby/LobbyFactory';
import { PlayerFactory } from '#matchmaking/domain/player/PlayerFactory';
import { LobbyIdFactory } from '#matchmaking/domain/lobby/lobbyId/LobbyIdFactory';
import { PlayerIdFactory } from '#common/domain/player/playerId/PlayerIdFactory';

export const factoryProviders: Provider[] = [
    LobbyConfigFactory,
    PlayerIdFactory,
    LobbyIdFactory,
    {
        provide: PlayerFactory,
        useFactory: (playerIdFactory: PlayerIdFactory) => new PlayerFactory(playerIdFactory),
        inject: [PlayerIdFactory],
    },
    {
        provide: LobbyFactory,
        useFactory: (lobbyIdFactory: LobbyIdFactory) => new LobbyFactory(lobbyIdFactory),
        inject: [LobbyIdFactory],
    },
];
