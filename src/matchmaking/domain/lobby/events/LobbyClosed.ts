import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';
import { LobbyEventType } from './LobbyEventType';

export type LobbyClosedPayload = Record<string, never>;

export class LobbyClosed implements DomainEvent {
    public readonly type = LobbyEventType.LobbyClosed.value;
    public readonly payload: LobbyClosedPayload = {};

    constructor() {}

    static fromPayload(_payload: EventPayload): LobbyClosed {
        return new LobbyClosed();
    }
}
