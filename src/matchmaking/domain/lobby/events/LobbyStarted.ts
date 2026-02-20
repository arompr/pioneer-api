import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { LobbyEventType } from './LobbyEventType';

export type LobbyStartedPayload = Record<string, never>;

export class LobbyStarted implements DomainEvent {
    public readonly type = LobbyEventType.LobbyStarted.value;
    public readonly payload: LobbyStartedPayload = {};

    constructor() {}

    static fromPayload(_payload: EventPayload): LobbyStarted {
        return new LobbyStarted();
    }
}
