import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyEventType } from './LobbyEventType';

export class LobbyClosed implements DomainEvent {
    public readonly type = LobbyEventType.LobbyClosed;
}
