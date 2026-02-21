import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { PlayerJoinedLobby, PlayerJoinedLobbyPayload } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby, PlayerLeftLobbyPayload } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyHostChanged, LobbyHostChangedPayload } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerMarkedPending, PlayerMarkedPendingPayload } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';
import { PlayerMarkedReady, PlayerMarkedReadyPayload } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { DomainEvent } from '#common/domain/events/DomainEvent';

export const playerJoinedLobbyFromOutbox = (message: OutboxMessage): PlayerJoinedLobby => {
    const { playerId } = message.eventPayload as PlayerJoinedLobbyPayload;
    return new PlayerJoinedLobby(playerId);
};

export const playerLeftLobbyFromOutbox = (message: OutboxMessage): PlayerLeftLobby => {
    const { playerId, wasHost } = message.eventPayload as PlayerLeftLobbyPayload;
    return new PlayerLeftLobby(playerId, wasHost);
};

export const lobbyClosedFromOutbox = (_message: OutboxMessage): LobbyClosed => new LobbyClosed();

export const lobbyHostChangedFromOutbox = (message: OutboxMessage): LobbyHostChanged => {
    const { newHostId } = message.eventPayload as LobbyHostChangedPayload;
    return new LobbyHostChanged(newHostId);
};

export const lobbyStartedFromOutbox = (_message: OutboxMessage): LobbyStarted => new LobbyStarted();

export const playerMarkedPendingFromOutbox = (message: OutboxMessage): PlayerMarkedPending => {
    const { playerId } = message.eventPayload as PlayerMarkedPendingPayload;
    return new PlayerMarkedPending(playerId);
};

export const playerMarkedReadyFromOutbox = (message: OutboxMessage): PlayerMarkedReady => {
    const { playerId } = message.eventPayload as PlayerMarkedReadyPayload;
    return new PlayerMarkedReady(playerId);
};
