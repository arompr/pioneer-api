/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, UseFilters } from '@nestjs/common';
import { UnknownCommandErrorFilter } from './interface/UnknownCommandErrorFilter';

export function UseInterfaceErrorFilters() {
    return applyDecorators(UseFilters(UnknownCommandErrorFilter));
}
