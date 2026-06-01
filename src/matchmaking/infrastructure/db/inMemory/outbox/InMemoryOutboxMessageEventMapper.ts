import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import { LobbyId } from '#matchmaking/domain/lobby/lobbyId/LobbyId';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import {
    LobbyClosedUseCaseEvent,
    LobbyHostChangedUseCaseEvent,
    LobbyStartedUseCaseEvent,
    PlayerJoinedLobbyUseCaseEvent,
    PlayerLeftLobbyUseCaseEvent,
    PlayerMarkedPendingUseCaseEvent,
    PlayerMarkedReadyUseCaseEvent,
} from '#matchmaking/usecase/events';
import {
    lobbyHostChangedPayloadSchema,
    playerJoinedLobbyPayloadSchema,
    playerLeftLobbyPayloadSchema,
    playerMarkedPendingPayloadSchema,
    playerMarkedReadyPayloadSchema,
} from './InMemoryOutboxMessagePayloads';

const toPlayerJoinedLobbyEvent = (message: OutboxMessage): PlayerJoinedLobbyUseCaseEvent => {
    const { playerId } = playerJoinedLobbyPayloadSchema.parse(message.eventPayload);
    return new PlayerJoinedLobbyUseCaseEvent(
        new LobbyId(message.aggregateId),
        new PlayerId(playerId)
    );
};

const toPlayerLeftLobbyEvent = (message: OutboxMessage): PlayerLeftLobbyUseCaseEvent => {
    const { playerId, wasHost } = playerLeftLobbyPayloadSchema.parse(message.eventPayload);
    return new PlayerLeftLobbyUseCaseEvent(
        new LobbyId(message.aggregateId),
        new PlayerId(playerId),
        wasHost
    );
};

const toLobbyClosedEvent = (message: OutboxMessage): LobbyClosedUseCaseEvent =>
    new LobbyClosedUseCaseEvent(new LobbyId(message.aggregateId));

const toLobbyHostChangedEvent = (message: OutboxMessage): LobbyHostChangedUseCaseEvent => {
    const { newHostId } = lobbyHostChangedPayloadSchema.parse(message.eventPayload);
    return new LobbyHostChangedUseCaseEvent(
        new LobbyId(message.aggregateId),
        new PlayerId(newHostId)
    );
};

const toLobbyStartedEvent = (message: OutboxMessage): LobbyStartedUseCaseEvent =>
    new LobbyStartedUseCaseEvent(new LobbyId(message.aggregateId));

const toPlayerMarkedPendingEvent = (message: OutboxMessage): PlayerMarkedPendingUseCaseEvent => {
    const { playerId } = playerMarkedPendingPayloadSchema.parse(message.eventPayload);
    return new PlayerMarkedPendingUseCaseEvent(
        new LobbyId(message.aggregateId),
        new PlayerId(playerId)
    );
};

const toPlayerMarkedReadyEvent = (message: OutboxMessage): PlayerMarkedReadyUseCaseEvent => {
    const { playerId } = playerMarkedReadyPayloadSchema.parse(message.eventPayload);
    return new PlayerMarkedReadyUseCaseEvent(
        new LobbyId(message.aggregateId),
        new PlayerId(playerId)
    );
};

const eventFactories: Readonly<Record<string, (message: OutboxMessage) => UseCaseEvent>> = {
    [LobbyEventType.PlayerJoinedLobby]: toPlayerJoinedLobbyEvent,
    [LobbyEventType.PlayerLeftLobby]: toPlayerLeftLobbyEvent,
    [LobbyEventType.LobbyClosed]: toLobbyClosedEvent,
    [LobbyEventType.LobbyHostChanged]: toLobbyHostChangedEvent,
    [LobbyEventType.LobbyStarted]: toLobbyStartedEvent,
    [LobbyEventType.PlayerMarkedPending]: toPlayerMarkedPendingEvent,
    [LobbyEventType.PlayerMarkedReady]: toPlayerMarkedReadyEvent,
};

/**
 * Mapper for reconstructing typed use case events from OutboxMessage instances.
 */
export class InMemoryOutboxMessageEventMapper {
    /**
     * Converts an OutboxMessage into the corresponding typed use case event instance.
     * Throws if the event type is not registered or the payload is malformed.
     *
     * @param {OutboxMessage} message - The outbox message to convert.
     * @returns {UseCaseEvent} The reconstructed use case event.
     * @throws {Error} If the event type is unknown.
     * @throws {import('zod').ZodError} If the payload does not match the expected schema.
     */
    static toUseCaseEvent(message: OutboxMessage): UseCaseEvent {
        const eventFactory = eventFactories[message.eventType];

        if (!eventFactory) {
            throw new Error(`Unknown event type: ${message.eventType}`);
        }

        return eventFactory(message);
    }
}
