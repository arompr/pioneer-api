import { Provider } from '@nestjs/common';
import { repositoryProviders } from './repositories';
import { factoryProviders } from './factories';
import { useCaseProviders } from './usecases';
import { eventBusProviders } from './eventBus';
import { processorProviders } from './processors';
import { authProviders } from './auth';

export const lobbyProviders: Provider[] = [
    ...repositoryProviders,
    ...factoryProviders,
    ...eventBusProviders,
    ...processorProviders,
    ...authProviders,
    ...useCaseProviders,
];
