import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OutboxProcessor } from '#matchmaking/infrastructure/processors/OutboxProcessor';
import { OutboxMessageMother } from '#test/matchmaking/domain/outbox/OutboxMessageMother';
import { InMemoryOutboxRepository } from '#matchmaking/infrastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { UseCaseEvent } from '#common/usecase/events/UseCaseEvent';
import { DomainEvent } from '#common/domain/events/DomainEvent';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyDomainEventDeserializer } from '#matchmaking/infrastructure/serializer/LobbyDomainEventDeserializer';

const EventBusMock = vi.fn(
    class {
        publish = vi.fn();
        register = vi.fn();
    }
);

const mockEventBus = new EventBusMock();

describe('OutboxProcessor', () => {
    let repository: InMemoryOutboxRepository;
    let processor: OutboxProcessor;
    const deserializer = new LobbyDomainEventDeserializer();

    beforeEach(() => {
        vi.resetAllMocks();
        repository = new InMemoryOutboxRepository();

        processor = new OutboxProcessor(repository, mockEventBus, deserializer);
        repository.registerObserver(processor);
    });

    describe('onMessagesAdded', () => {
        describe('when new messages are added to the outbox', () => {
            it('publishes the message to the event bus', () => {
                const message = OutboxMessageMother.playerJoined();

                repository.save(message);

                const published = mockEventBus.publish.mock
                    .calls[0][0] as UseCaseEvent<DomainEvent>;
                expect(published.event).toBeInstanceOf(PlayerJoinedLobby);
            });
        });

        describe('when multiple messages are added', () => {
            it('processes all messages in order', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');

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

                mockEventBus.publish.mockImplementationOnce(() => {
                    throw new Error('Processing failed');
                });

                repository.save(message1);
                repository.save(message2);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
                mockEventBus.publish.mockClear();

                const message3 = OutboxMessageMother.playerJoined('lobby-3');
                repository.save(message3);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
                const published = mockEventBus.publish.mock
                    .calls[0][0] as UseCaseEvent<DomainEvent>;
                expect(published.event).toBeInstanceOf(PlayerJoinedLobby);
            });
        });
    });
});
