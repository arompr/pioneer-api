/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, UseFilters } from '@nestjs/common';
import { LobbyNotFoundWsErrorFilter } from './usecase/LobbyNotFoundErrorFilter';

export function UseUseCaseErrorFilters() {
    return applyDecorators(UseFilters(LobbyNotFoundWsErrorFilter));
}
