import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OutboxProcessor } from '#matchmaking/infrastructure/processors/OutboxProcessor';
import { OutboxMessageMother } from '#test/matchmaking/domain/outbox/OutboxMessageMother';
import { InMemoryOutboxRepository } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { DomainEventDeserializer } from '#matchmaking/domain/outbox/DomainEventDeserializer';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';

const EventBusMock = vi.fn(
    class {
        publish = vi.fn();
        register = vi.fn();
    }
);

const DeserializerMock = vi.fn(
    class implements DomainEventDeserializer {
        deserialize = vi.fn();
    }
);

const mockEventBus = new EventBusMock();
const mockDeserializer = new DeserializerMock();

function setupDeserializer(
    messageEventType: string,
    messagePayload: Record<string, unknown>
): void {
    mockDeserializer.deserialize.mockImplementation((eventType: string) => {
        if (eventType === 'PlayerJoinedLobby') {
            return new PlayerJoinedLobby(
                new PlayerId((messagePayload as { playerId: string }).playerId)
            );
        }
        if (eventType === 'PlayerLeftLobby') {
            const payload = messagePayload as { playerId: string; wasHost: boolean };
            return new PlayerLeftLobby(new PlayerId(payload.playerId), payload.wasHost);
        }
        throw new Error(`Unknown event type: ${eventType}`);
    });
}

describe('OutboxProcessor', () => {
    let repository: InMemoryOutboxRepository;
    let processor: OutboxProcessor;

    beforeEach(() => {
        vi.resetAllMocks();
        repository = new InMemoryOutboxRepository();
        processor = new OutboxProcessor(repository, mockEventBus, mockDeserializer);
        repository.registerObserver(processor);
    });

    describe('onMessagesAdded', () => {
        describe('when new messages are added to the outbox', () => {
            it('publishes the message to the event bus', () => {
                const message = OutboxMessageMother.playerJoined();
                setupDeserializer(message.eventType, message.eventPayload);

                repository.save(message);

                expect(mockEventBus.publish).toHaveBeenCalledOnce();
                const published = mockEventBus.publish.mock
                    .calls[0][0] as UseCaseEvent<DomainEvent>;
                expect(published.event).toBeInstanceOf(PlayerJoinedLobby);
            });
        });

        describe('when multiple messages are added', () => {
            it('processes all messages in order', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');
                setupDeserializer(message1.eventType, message1.eventPayload);

                repository.save(message1);
                repository.save(message2);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
                const first = mockEventBus.publish.mock.calls[0][0] as UseCaseEvent<DomainEvent>;
                const second = mockEventBus.publish.mock.calls[1][0] as UseCaseEvent<DomainEvent>;
                expect(first.event).toBeInstanceOf(PlayerJoinedLobby);
                expect(second.event).toBeInstanceOf(PlayerLeftLobby);
            });
        });

        describe('when messages are added during processing', () => {
            it('processes the new messages before becoming idle', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');
                const message3 = OutboxMessageMother.playerJoined('lobby-3');
                setupDeserializer(message1.eventType, message1.eventPayload);

                mockEventBus.publish.mockImplementationOnce(() => {
                    if (mockEventBus.publish.mock.calls.length === 1) {
                        repository.save(message3);
                    }
                });

                repository.save(message1);
                repository.save(message2);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(3);
            });
        });

        describe('when an error occurs during event publishing', () => {
            it('continues processing remaining messages', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');
                const message3 = OutboxMessageMother.playerJoined('lobby-3');
                setupDeserializer(message1.eventType, message1.eventPayload);

                mockEventBus.publish.mockImplementationOnce((event: UseCaseEvent<DomainEvent>) => {
                    if (event.event.type === message2.eventType) {
                        throw new Error('Processing failed for message 2');
                    }
                });

                repository.save(message1);
                repository.save(message2);
                repository.save(message3);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(3);
            });

            it('continues processing subsequent messages after an error', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');
                setupDeserializer(message1.eventType, message1.eventPayload);

                mockEventBus.publish.mockImplementationOnce(() => {
                    throw new Error('Processing failed');
                });

                repository.save(message1);
                repository.save(message2);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
                mockEventBus.publish.mockClear();

                const message3 = OutboxMessageMother.playerJoined('lobby-3');
                setupDeserializer(message3.eventType, message3.eventPayload);
                repository.save(message3);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
                const published = mockEventBus.publish.mock
                    .calls[0][0] as UseCaseEvent<DomainEvent>;
                expect(published.event).toBeInstanceOf(PlayerJoinedLobby);
            });
        });
    });
});
