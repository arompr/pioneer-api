import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { LobbyHostChanged } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { PlayerMarkedPending } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
import { PlayerMarkedReady } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';

const eventFactories: Readonly<Record<string, (eventPayload: EventPayload) => DomainEvent>> = {
    [LobbyEventType.PlayerJoinedLobby.value]: (payload) => PlayerJoinedLobby.fromPayload(payload),
    [LobbyEventType.PlayerLeftLobby.value]: (payload) => PlayerLeftLobby.fromPayload(payload),
    [LobbyEventType.LobbyClosed.value]: (payload) => LobbyClosed.fromPayload(payload),
    [LobbyEventType.LobbyHostChanged.value]: (payload) => LobbyHostChanged.fromPayload(payload),
    [LobbyEventType.LobbyStarted.value]: (payload) => LobbyStarted.fromPayload(payload),
    [LobbyEventType.PlayerMarkedPending.value]: (payload) =>
        PlayerMarkedPending.fromPayload(payload),
    [LobbyEventType.PlayerMarkedReady.value]: (payload) => PlayerMarkedReady.fromPayload(payload),
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
            return eventFactory(message.eventPayload);
        }

        return { type: message.eventType, payload: message.eventPayload };
    }
}
