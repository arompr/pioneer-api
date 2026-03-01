/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { applyDecorators, UseFilters } from '@nestjs/common';
import { UnknownCommandErrorFilter } from './interface/UnknownCommandErrorFilter';
import { SocketAlreadyAuthenticatedErrorFilter } from './interface/SocketAlreadyAuthenticatedErrorFilter';
import { SocketNotAuthenticatedErrorFilter } from './interface/SocketNotAuthenticatedErrorFilter';

export function UseInterfaceErrorFilters() {
    return applyDecorators(
        UseFilters(
            UnknownCommandErrorFilter,
            SocketAlreadyAuthenticatedErrorFilter,
            SocketNotAuthenticatedErrorFilter
        )
    );
}
