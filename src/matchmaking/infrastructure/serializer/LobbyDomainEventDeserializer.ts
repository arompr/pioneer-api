import { z } from 'zod';
import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { DomainEventDeserializer } from '#matchmaking/domain/outbox/DomainEventDeserializer';
import { Identity } from '#common/domain/aggregate/AggregateRoot';
import {
    LobbyEventType,
    LobbyClosed,
    LobbyHostChanged,
    LobbyStarted,
    PlayerJoinedLobby,
    PlayerLeftLobby,
    PlayerMarkedPending,
    PlayerMarkedReady,
} from '#matchmaking/domain/lobby/events/index';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

const playerJoinedLobbySchema = z.object({ playerId: z.string() });
const playerLeftLobbySchema = z.object({ playerId: z.string(), wasHost: z.boolean() });
const lobbyHostChangedSchema = z.object({ newHostId: z.string() });
const playerMarkedPendingSchema = z.object({ playerId: z.string() });
const playerMarkedReadySchema = z.object({ playerId: z.string() });

type DeserializeFn = (aggregateId: Identity, payload: EventPayload) => DomainEvent;

const deserializePlayerJoinedLobby: DeserializeFn = (_aggregateId, payload) => {
    const { playerId } = playerJoinedLobbySchema.parse(payload);
    return new PlayerJoinedLobby(new PlayerId(playerId));
};

const deserializePlayerLeftLobby: DeserializeFn = (_aggregateId, payload) => {
    const { playerId, wasHost } = playerLeftLobbySchema.parse(payload);
    return new PlayerLeftLobby(new PlayerId(playerId), wasHost);
};

const deserializeLobbyHostChanged: DeserializeFn = (_aggregateId, payload) => {
    const { newHostId } = lobbyHostChangedSchema.parse(payload);
    return new LobbyHostChanged(new PlayerId(newHostId));
};

const deserializePlayerMarkedReady: DeserializeFn = (_aggregateId, payload) => {
    const { playerId } = playerMarkedReadySchema.parse(payload);
    return new PlayerMarkedReady(new PlayerId(playerId));
};

const deserializePlayerMarkedPending: DeserializeFn = (_aggregateId, payload) => {
    const { playerId } = playerMarkedPendingSchema.parse(payload);
    return new PlayerMarkedPending(new PlayerId(playerId));
};

const deserializeEmpty: DeserializeFn = () => new LobbyClosed();
const deserializeLobbyStarted: DeserializeFn = () => new LobbyStarted();

const deserializerFactories = {
    [LobbyEventType.PlayerJoinedLobby]: deserializePlayerJoinedLobby,
    [LobbyEventType.PlayerLeftLobby]: deserializePlayerLeftLobby,
    [LobbyEventType.LobbyHostChanged]: deserializeLobbyHostChanged,
    [LobbyEventType.LobbyClosed]: deserializeEmpty,
    [LobbyEventType.LobbyStarted]: deserializeLobbyStarted,
    [LobbyEventType.PlayerMarkedReady]: deserializePlayerMarkedReady,
    [LobbyEventType.PlayerMarkedPending]: deserializePlayerMarkedPending,
} as const satisfies Record<LobbyEventType, DeserializeFn>;

/**
 * Deserializes lobby domain events from primitive payloads back into typed domain event instances.
 */
export class LobbyDomainEventDeserializer implements DomainEventDeserializer {
    deserialize(eventType: string, aggregateId: Identity, payload: EventPayload): DomainEvent {
        const factory = deserializerFactories[eventType as LobbyEventType];

        if (!factory) {
            throw new Error(`Unknown domain event type: ${eventType}`);
        }

        return factory(aggregateId, payload);
    }
}
