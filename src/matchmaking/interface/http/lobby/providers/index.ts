import { Provider } from '@nestjs/common';
import { repositoryProviders } from './repositories';
import { factoryProviders } from './factories';
import { useCaseProviders } from './usecases';
import { eventBusProviders } from './eventBus';
import { processorProviders } from './processors';

export const lobbyProviders: Provider[] = [
    ...repositoryProviders,
    ...factoryProviders,
    ...eventBusProviders,
    ...processorProviders,
    ...useCaseProviders,
];
