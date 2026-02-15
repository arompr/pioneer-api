import { Provider } from '@nestjs/common';
import { repositoryProviders } from './repositories';
import { factoryProviders } from './factories';
import { useCaseProviders } from './usecases';
import { eventBusProviders } from './eventBus';

export const lobbyProviders: Provider[] = [
    ...repositoryProviders,
    ...factoryProviders,
    ...eventBusProviders,
    ...useCaseProviders,
];
