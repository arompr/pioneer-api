import { DomainEvent } from '#common/domain/events/DomainEvent';

export type LobbyStartedPayload = Record<string, never>;

export class LobbyStarted implements DomainEvent<LobbyStartedPayload> {
    public readonly type = 'LobbyStarted';
    public readonly payload: LobbyStartedPayload = {};

    constructor() {}
}
