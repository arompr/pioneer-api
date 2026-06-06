import { Provider } from '@nestjs/common';
import { repositoryProviders } from './repositories';
import { factoryProviders } from './factories';
import { useCaseProviders } from './usecases';

import { authProviders } from './auth';
import { gatewayProviders } from './gateways';

export const lobbyProviders: Provider[] = [
    ...repositoryProviders,
    ...factoryProviders,
    ...authProviders,
    ...useCaseProviders,
    ...gatewayProviders,
];
