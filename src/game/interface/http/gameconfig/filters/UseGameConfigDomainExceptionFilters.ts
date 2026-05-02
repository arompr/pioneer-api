/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, UseFilters } from '@nestjs/common';
import { UnsupportedGameModeErrorFilter } from './domain/UnsupportedGameModeErrorFilter';
import { GameConfigNotFoundErrorFilter } from './domain/GameConfigNotFoundErrorFilter';

export function UseGameConfigDomainExceptionFilters() {
    return applyDecorators(
        UseFilters(UnsupportedGameModeErrorFilter, GameConfigNotFoundErrorFilter)
    );
}
