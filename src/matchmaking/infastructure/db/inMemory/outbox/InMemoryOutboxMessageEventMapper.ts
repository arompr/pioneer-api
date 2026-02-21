import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { LobbyHostChanged } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { PlayerMarkedPending } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
import { PlayerMarkedReady } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';

const eventFactories: Readonly<Record<string, (message: OutboxMessage) => DomainEvent>> = {
    [LobbyEventType.PlayerJoinedLobby.value]: (message) =>
        PlayerJoinedLobby.fromPayload(message.eventPayload),
    [LobbyEventType.PlayerLeftLobby.value]: (message) =>
        PlayerLeftLobby.fromPayload(message.eventPayload),
    [LobbyEventType.LobbyClosed.value]: (message) => LobbyClosed.fromPayload(message.eventPayload),
    [LobbyEventType.LobbyHostChanged.value]: (message) =>
        LobbyHostChanged.fromPayload(message.eventPayload),
    [LobbyEventType.LobbyStarted.value]: (message) =>
        LobbyStarted.fromPayload(message.eventPayload),
    [LobbyEventType.PlayerMarkedPending.value]: (message) =>
        PlayerMarkedPending.fromPayload(message.eventPayload),
    [LobbyEventType.PlayerMarkedReady.value]: (message) =>
        PlayerMarkedReady.fromPayload(message.eventPayload),
};

/**
 * Mapper for reconstructing typed domain events from OutboxMessage instances.
 */
export class OutboxMessageDomainEventMapper {
    /**
     * Converts an OutboxMessage into the corresponding typed domain event instance.
     * Falls back to a plain `{ type, payload }` object for unrecognised event types.
     *
     * @param {OutboxMessage} message - The outbox message to convert.
     * @returns {DomainEvent} The reconstructed domain event, or a plain event object if the type is not registered.
     */
    static toDomainEvent(message: OutboxMessage): DomainEvent {
        const eventFactory = eventFactories[message.eventType];

        if (eventFactory) {
            return eventFactory(message);
        }

        return { type: message.eventType, payload: message.eventPayload };
    }
}
