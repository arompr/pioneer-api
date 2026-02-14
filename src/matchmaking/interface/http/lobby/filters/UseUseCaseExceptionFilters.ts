/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, UseFilters } from '@nestjs/common';
import { LobbyNotFoundErrorFilter } from './usecase/LobbyNotFoundErrorFilter';

export function UseUseCaseExceptionFilters() {
    return applyDecorators(UseFilters(LobbyNotFoundErrorFilter));
}
