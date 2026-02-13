import { DomainEvent } from '#common/domain/events/DomainEvent';

export type LobbyClosedPayload = Record<string, never>;

export class LobbyClosed implements DomainEvent<LobbyClosedPayload> {
    public readonly type = 'LobbyClosed';
    public readonly payload: LobbyClosedPayload = {};

    constructor() {}
}
