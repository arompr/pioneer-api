/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators } from '@nestjs/common';
import { UseDomainErrorFilters } from './UseDomainErrorFilters';
import { UseUseCaseErrorFilters } from './UseUseCaseErrorFilters';

export function UseErrorFilters() {
    return applyDecorators(UseDomainErrorFilters(), UseUseCaseErrorFilters());
}
