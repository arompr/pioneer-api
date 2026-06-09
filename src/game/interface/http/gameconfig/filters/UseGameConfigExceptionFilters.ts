/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators } from '@nestjs/common';
import { UseGameConfigDomainExceptionFilters } from './UseGameConfigDomainExceptionFilters';
import { UseGameConfigUseCaseExceptionFilters } from './UseGameConfigUseCaseExceptionFilters';

export function UseGameConfigExceptionFilters() {
    return applyDecorators(
        UseGameConfigDomainExceptionFilters(),
        UseGameConfigUseCaseExceptionFilters()
    );
}
