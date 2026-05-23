import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { PlayerJoinedLobbyPayload } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobbyPayload } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyHostChangedPayload } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { PlayerMarkedReadyPayload } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { PlayerMarkedPendingPayload } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
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

const eventFactories: Readonly<Record<string, (message: OutboxMessage) => UseCaseEvent>> = {
    [LobbyEventType.PlayerJoinedLobby.value]: (message) => {
        const { playerId } = message.eventPayload as PlayerJoinedLobbyPayload;
        return new PlayerJoinedLobbyUseCaseEvent(message.aggregateId, playerId);
    },
    [LobbyEventType.PlayerLeftLobby.value]: (message) => {
        const { playerId, wasHost } = message.eventPayload as PlayerLeftLobbyPayload;
        return new PlayerLeftLobbyUseCaseEvent(message.aggregateId, playerId, wasHost);
    },
    [LobbyEventType.LobbyClosed.value]: (message) =>
        new LobbyClosedUseCaseEvent(message.aggregateId),
    [LobbyEventType.LobbyHostChanged.value]: (message) => {
        const { newHostId } = message.eventPayload as LobbyHostChangedPayload;
        return new LobbyHostChangedUseCaseEvent(message.aggregateId, newHostId);
    },
    [LobbyEventType.LobbyStarted.value]: (message) =>
        new LobbyStartedUseCaseEvent(message.aggregateId),
    [LobbyEventType.PlayerMarkedPending.value]: (message) => {
        const { playerId } = message.eventPayload as PlayerMarkedPendingPayload;
        return new PlayerMarkedPendingUseCaseEvent(message.aggregateId, playerId);
    },
    [LobbyEventType.PlayerMarkedReady.value]: (message) => {
        const { playerId } = message.eventPayload as PlayerMarkedReadyPayload;
        return new PlayerMarkedReadyUseCaseEvent(message.aggregateId, playerId);
    },
};

/**
 * Mapper for reconstructing typed use case events from OutboxMessage instances.
 */
export class InMemoryOutboxMessageEventMapper {
    /**
     * Converts an OutboxMessage into the corresponding typed use case event instance.
     * Falls back to a plain `{ type, payload, aggregateId }` object for unrecognised event types.
     *
     * @param {OutboxMessage} message - The outbox message to convert.
     * @returns {UseCaseEvent} The reconstructed use case event, or a plain event object if the type is not registered.
     */
    static toUseCaseEvent(message: OutboxMessage): UseCaseEvent {
        const eventFactory = eventFactories[message.eventType];

        if (eventFactory) {
            return eventFactory(message);
        }

        return {
            type: message.eventType,
            payload: message.eventPayload,
            aggregateId: message.aggregateId,
        };
    }
}
