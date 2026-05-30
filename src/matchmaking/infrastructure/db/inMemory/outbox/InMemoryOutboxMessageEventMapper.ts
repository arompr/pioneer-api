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
    LobbyHostChangedPayload,
    PlayerJoinedLobbyPayload,
    PlayerLeftLobbyPayload,
    PlayerMarkedPendingPayload,
    PlayerMarkedReadyPayload,
} from './InMemoryOutboxMessagePayloads';

const toPlayerJoinedLobbyEvent = (message: OutboxMessage): PlayerJoinedLobbyUseCaseEvent => {
    const { playerId } = message.eventPayload as PlayerJoinedLobbyPayload;
    return new PlayerJoinedLobbyUseCaseEvent(
        message.aggregateId,
        new LobbyId(message.aggregateId),
        new PlayerId(playerId)
    );
};

const toPlayerLeftLobbyEvent = (message: OutboxMessage): PlayerLeftLobbyUseCaseEvent => {
    const { playerId, wasHost } = message.eventPayload as PlayerLeftLobbyPayload;
    return new PlayerLeftLobbyUseCaseEvent(
        message.aggregateId,
        new LobbyId(message.aggregateId),
        new PlayerId(playerId),
        wasHost
    );
};

const toLobbyClosedEvent = (message: OutboxMessage): LobbyClosedUseCaseEvent =>
    new LobbyClosedUseCaseEvent(message.aggregateId, new LobbyId(message.aggregateId));

const toLobbyHostChangedEvent = (message: OutboxMessage): LobbyHostChangedUseCaseEvent => {
    const { newHostId } = message.eventPayload as LobbyHostChangedPayload;
    return new LobbyHostChangedUseCaseEvent(
        message.aggregateId,
        new LobbyId(message.aggregateId),
        new PlayerId(newHostId)
    );
};

const toLobbyStartedEvent = (message: OutboxMessage): LobbyStartedUseCaseEvent =>
    new LobbyStartedUseCaseEvent(message.aggregateId, new LobbyId(message.aggregateId));

const toPlayerMarkedPendingEvent = (message: OutboxMessage): PlayerMarkedPendingUseCaseEvent => {
    const { playerId } = message.eventPayload as PlayerMarkedPendingPayload;
    return new PlayerMarkedPendingUseCaseEvent(
        message.aggregateId,
        new LobbyId(message.aggregateId),
        new PlayerId(playerId)
    );
};

const toPlayerMarkedReadyEvent = (message: OutboxMessage): PlayerMarkedReadyUseCaseEvent => {
    const { playerId } = message.eventPayload as PlayerMarkedReadyPayload;
    return new PlayerMarkedReadyUseCaseEvent(
        message.aggregateId,
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
     * Throws if the event type is not registered.
     *
     * @param {OutboxMessage} message - The outbox message to convert.
     * @returns {UseCaseEvent} The reconstructed use case event.
     * @throws {Error} If the event type is unknown.
     */
    static toUseCaseEvent(message: OutboxMessage): UseCaseEvent {
        const eventFactory = eventFactories[message.eventType];

        if (!eventFactory) {
            throw new Error(`Unknown event type: ${message.eventType}`);
        }

        return eventFactory(message);
    }
}
