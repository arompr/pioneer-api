import { DomainEvent } from '#common/domain/events/DomainEvent';

export class LobbyStarted implements DomainEvent {
    public readonly type = 'LobbyStarted';

    constructor() {}
}
