/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, UseFilters } from '@nestjs/common';
import { UnsupportedGameModeErrorFilter } from './domain/UnsupportedGameModeErrorFilter';
import { InvalidLobbyStateErrorFilter } from './domain/InvalidLobbyStateErrorFilter';
import { InvalidLobbyGameModeErrorFilter } from './domain/InvalidLobbyGameModeErrorFilter';
import { PlayerIsNotHostErrorFilter } from './domain/PlayerIsNotHostErrorFilter';
import { LobbyNotReadyToStartErrorFilter } from './domain/LobbyNotReadyToStartErrorFilter';
import { LobbyFullErrorFilter } from './domain/LobbyFullErrorFilter';
import { LobbyClosedErrorFilter } from './domain/LobbyClosedErrorFilter';
import { LobbyAlreadyInGameErrorFilter } from './domain/LobbyAlreadyInGameErrorFilter';
import { PlayerAlreadyInLobbyErrorFilter } from './domain/PlayerAlreadyInLobbyErrorFilter';
import { PlayerNotFoundInLobbyErrorFilter } from './domain/PlayerNotFoundInLobbyErrorFilter';
import { MinPlayersExceedsMaxPlayersErrorFilter } from './domain/MinPlayersExceedsMaxPlayersErrorFilter';
import { InvalidMinPlayersErrorFilter } from './domain/InvalidMinPlayersErrorFilter';
import { InvalidPlayerStatusErrorFilter } from './domain/InvalidPlayerStatusErrorFilter';
import { InvalidPlayerTokenErrorFilter } from './domain/InvalidPlayerTokenErrorFilter';

export function UseDomainErrorFilters() {
    return applyDecorators(
        UseFilters(
            UnsupportedGameModeErrorFilter,
            InvalidLobbyStateErrorFilter,
            InvalidLobbyGameModeErrorFilter,
            PlayerIsNotHostErrorFilter,
            LobbyNotReadyToStartErrorFilter,
            LobbyFullErrorFilter,
            LobbyClosedErrorFilter,
            LobbyAlreadyInGameErrorFilter,
            PlayerAlreadyInLobbyErrorFilter,
            PlayerNotFoundInLobbyErrorFilter,
            MinPlayersExceedsMaxPlayersErrorFilter,
            InvalidMinPlayersErrorFilter,
            InvalidPlayerStatusErrorFilter,
            InvalidPlayerTokenErrorFilter
        )
    );
}
