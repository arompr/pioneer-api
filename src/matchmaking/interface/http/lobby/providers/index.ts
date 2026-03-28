import { Provider } from '@nestjs/common';
import { repositoryProviders } from './repositories';
import { factoryProviders } from './factories';
import { useCaseProviders } from './usecases';

import { authProviders } from './auth';

export const lobbyProviders: Provider[] = [
    ...repositoryProviders,
    ...factoryProviders,
    ...authProviders,
    ...useCaseProviders,
];
