import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { DomainEventSerializer } from '#matchmaking/domain/outbox/DomainEventSerializer';
import {
    LobbyEventType,
    LobbyHostChanged,
    PlayerJoinedLobby,
    PlayerLeftLobby,
    PlayerMarkedPending,
    PlayerMarkedReady,
} from '#matchmaking/domain/lobby/events/index';

const serializePlayerJoinedLobby = (event: DomainEvent): EventPayload => {
    const playerJoinedLobby = event as PlayerJoinedLobby;
    return { playerId: playerJoinedLobby.playerId.value };
};

const serializePlayerLeftLobby = (event: DomainEvent): EventPayload => {
    const playerLeftLobby = event as PlayerLeftLobby;
    return {
        playerId: playerLeftLobby.playerId.value,
        wasHost: playerLeftLobby.wasHost,
    };
};

const serializeLobbyHostChanged = (event: DomainEvent): EventPayload => {
    const lobbyHostChanged = event as LobbyHostChanged;
    return {
        newHostId: lobbyHostChanged.newHostId.value,
    };
};

const serializePlayerMarkedReady = (event: DomainEvent): EventPayload => {
    const playerMarkedReady = event as PlayerMarkedReady;
    return {
        playerId: playerMarkedReady.playerId.value,
    };
};

const serializePlayerMarkedPending = (event: DomainEvent): EventPayload => {
    const playerMarkedPending = event as PlayerMarkedPending;
    return {
        playerId: playerMarkedPending.playerId.value,
    };
};

const serializeEmpty = (): EventPayload => ({});

type EventSerializerFn = (event: DomainEvent) => EventPayload;
const serializerFactories = {
    [LobbyEventType.PlayerJoinedLobby]: serializePlayerJoinedLobby,
    [LobbyEventType.PlayerLeftLobby]: serializePlayerLeftLobby,
    [LobbyEventType.LobbyHostChanged]: serializeLobbyHostChanged,
    [LobbyEventType.LobbyClosed]: serializeEmpty,
    [LobbyEventType.LobbyStarted]: serializeEmpty,
    [LobbyEventType.PlayerMarkedReady]: serializePlayerMarkedReady,
    [LobbyEventType.PlayerMarkedPending]: serializePlayerMarkedPending,
} as const satisfies Record<LobbyEventType, EventSerializerFn>;

/**
 * Serializes lobby domain events into plain primitive payloads for outbox persistence.
 */
export class LobbyDomainEventSerializer implements DomainEventSerializer {
    serialize(event: DomainEvent): EventPayload {
        const factory = serializerFactories[event.type as LobbyEventType];

        if (!factory) {
            throw new Error(`Unknown domain event type: ${event.type}`);
        }

        return factory(event);
    }
}
