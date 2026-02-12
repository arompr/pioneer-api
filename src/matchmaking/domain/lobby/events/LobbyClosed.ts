import { DomainEvent } from '#common/domain/events/DomainEvent';

export class LobbyClosed implements DomainEvent {
    public readonly type = 'LobbyClosed';

    constructor() {}
}
