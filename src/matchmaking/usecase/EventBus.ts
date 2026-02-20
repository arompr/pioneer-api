import { DomainEvent } from '#common/domain/events/DomainEvent';
import { LobbyEventType } from '#matchmaking/domain/lobby/events/LobbyEventType';
import { EventHandler } from './EventHandler';

export interface EventBus {
    publish<T extends DomainEvent>(event: T): void;
    register<T extends DomainEvent>(eventType: LobbyEventType, handler: EventHandler<T>): void;
}
