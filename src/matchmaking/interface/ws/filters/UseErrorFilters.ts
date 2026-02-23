/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators } from '@nestjs/common';
import { UseUseCaseErrorFilters } from './UseUseCaseErrorFilters';
import { UseInterfaceErrorFilters } from './UseInterfaceErrorFilters';
import { UseDomainErrorFilters } from './UseDomainErrorFilters';

export function UseErrorFilters() {
    return applyDecorators(
        UseUseCaseErrorFilters(),
        UseInterfaceErrorFilters(),
        UseDomainErrorFilters()
    );
}
