import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OutboxProcessor } from '#matchmaking/infastructure/processors/OutboxProcessor';
import { OutboxMessageMother } from '#test/matchmaking/domain/outbox/OutboxMessageMother';
import { InMemoryOutboxRepository } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { DomainEvent, EventPayload } from '#common/domain/events/DomainEvent';

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

    beforeEach(() => {
        vi.resetAllMocks();
        repository = new InMemoryOutboxRepository();
        processor = new OutboxProcessor(repository, mockEventBus);
        repository.registerObserver(processor);
    });

    describe('onMessagesAdded', () => {
        describe('when new messages are added to the outbox', () => {
            it('publishes the message to the event bus', () => {
                const message = OutboxMessageMother.playerJoined();

                repository.save(message);

                expect(mockEventBus.publish).toHaveBeenCalledOnce();
                expect(mockEventBus.publish).toHaveBeenCalledWith({
                    type: message.eventType,
                    payload: message.eventPayload,
                });
            });
        });

        describe('when multiple messages are added', () => {
            it('processes all messages in order', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');

                repository.save(message1);
                repository.save(message2);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(2);
                expect(mockEventBus.publish).toHaveBeenNthCalledWith(1, {
                    type: message1.eventType,
                    payload: message1.eventPayload,
                });
                expect(mockEventBus.publish).toHaveBeenNthCalledWith(2, {
                    type: message2.eventType,
                    payload: message2.eventPayload,
                });
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
                mockEventBus.publish.mockImplementationOnce((event: DomainEvent<EventPayload>) => {
                    if (event.type === message2.eventType) {
                        throw new Error('Processing failed for message 2');
                    }
                });

                repository.save(message1);
                repository.save(message2);
                repository.save(message3);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(3);
            });

            it('does not process the same message again after an error', () => {
                const message1 = OutboxMessageMother.playerJoined('lobby-1');
                const message2 = OutboxMessageMother.playerLeft('lobby-2');
                mockEventBus.publish.mockImplementationOnce(() => {
                    throw new Error('Processing failed');
                });

                repository.save(message1);
                repository.save(message2);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(2);

                const message3 = OutboxMessageMother.playerJoined('lobby-3');
                repository.save(message3);

                expect(mockEventBus.publish).toHaveBeenCalledTimes(3);
                expect(mockEventBus.publish).toHaveBeenNthCalledWith(3, {
                    type: message3.eventType,
                    payload: message3.eventPayload,
                });
            });
        });
    });
});
