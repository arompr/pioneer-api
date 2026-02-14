/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators } from '@nestjs/common';
import { UseDomainExceptionFilters } from './UseDomainExceptionFilters';
import { UseUseCaseExceptionFilters } from './UseUseCaseExceptionFilters';

export function UseExceptionFilters() {
    return applyDecorators(UseDomainExceptionFilters(), UseUseCaseExceptionFilters());
}
