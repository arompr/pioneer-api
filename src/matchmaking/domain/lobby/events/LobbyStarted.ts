import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyEventType } from './LobbyEventType';

export class LobbyStarted implements DomainEvent {
    public readonly type = LobbyEventType.LobbyStarted;
}
