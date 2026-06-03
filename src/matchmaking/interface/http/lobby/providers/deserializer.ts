import { Provider } from '@nestjs/common';
import { LobbyDomainEventDeserializer } from '#matchmaking/infrastructure/serializer/LobbyDomainEventDeserializer';

export const DOMAIN_EVENT_DESERIALIZER = Symbol('DomainEventDeserializer');

export const deserializerProviders: Provider[] = [
    {
        provide: DOMAIN_EVENT_DESERIALIZER,
        useClass: LobbyDomainEventDeserializer,
    },
];
