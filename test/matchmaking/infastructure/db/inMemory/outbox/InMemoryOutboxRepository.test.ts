import { InMemoryOutboxRepository } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { OutboxObserver } from '#matchmaking/domain/outbox/OutboxObserver';
import { describe, expect, it, vi } from 'vitest';
import { OutboxMessageMother } from '#test/matchmaking/domain/outbox/OutboxMessageMother';

describe('InMemoryOutboxRepository', () => {
    describe('save', () => {
        it('stores a message in the repository', () => {
            const repository = new InMemoryOutboxRepository();
            const message = OutboxMessageMother.any();

            repository.save(message);

            const unprocessed = repository.findUnprocessed();
            expect(unprocessed).toHaveLength(1);
            expect(unprocessed[0].id.equals(message.id)).toBe(true);
        });

        it('notifies registered observers when a message is saved', () => {
            const repository = new InMemoryOutboxRepository();
            const onMessagesAddedMock = vi.fn();
            const observer: OutboxObserver = {
                onMessagesAdded: onMessagesAddedMock,
            };
            repository.registerObserver(observer);
            const message = OutboxMessageMother.any();

            repository.save(message);

            expect(onMessagesAddedMock).toHaveBeenCalledOnce();
        });

        it('notifies all registered observers', () => {
            const repository = new InMemoryOutboxRepository();
            const onMessagesAddedMock1 = vi.fn();
            const onMessagesAddedMock2 = vi.fn();
            const observer1: OutboxObserver = { onMessagesAdded: onMessagesAddedMock1 };
            const observer2: OutboxObserver = { onMessagesAdded: onMessagesAddedMock2 };
            repository.registerObserver(observer1);
            repository.registerObserver(observer2);
            const message = OutboxMessageMother.playerJoined();

            repository.save(message);

            expect(onMessagesAddedMock1).toHaveBeenCalledOnce();
            expect(onMessagesAddedMock2).toHaveBeenCalledOnce();
        });
    });

    describe('saveAll', () => {
        it('stores multiple messages in the repository', () => {
            const repository = new InMemoryOutboxRepository();
            const message1 = OutboxMessageMother.playerJoined();
            const message2 = OutboxMessageMother.playerLeft();
            repository.saveAll([message1, message2]);
            const unprocessed = repository.findUnprocessed();
            expect(unprocessed).toHaveLength(2);
            expect(unprocessed.some((m) => m.id.equals(message1.id))).toBe(true);
            expect(unprocessed.some((m) => m.id.equals(message2.id))).toBe(true);
        });

        it('does not notify observers when saving an empty array', () => {
            const repository = new InMemoryOutboxRepository();
            const onMessagesAddedMock = vi.fn();
            const observer: OutboxObserver = { onMessagesAdded: onMessagesAddedMock };
            repository.registerObserver(observer);

            repository.saveAll([]);

            expect(onMessagesAddedMock).not.toHaveBeenCalled();
        });

        it('notifies registered observers once when saving multiple messages', () => {
            const repository = new InMemoryOutboxRepository();
            const onMessagesAddedMock = vi.fn();
            const observer: OutboxObserver = { onMessagesAdded: onMessagesAddedMock };
            repository.registerObserver(observer);
            const message1 = OutboxMessageMother.playerJoined();
            const message2 = OutboxMessageMother.playerLeft();
            repository.saveAll([message1, message2]);
            expect(onMessagesAddedMock).toHaveBeenCalledOnce();
        });
    });

    describe('findUnprocessed', () => {
        it('returns all stored messages', () => {
            const repository = new InMemoryOutboxRepository();
            const message1 = OutboxMessageMother.playerJoined();
            const message2 = OutboxMessageMother.playerLeft();
            repository.save(message1);
            repository.save(message2);

            const unprocessed = repository.findUnprocessed();

            expect(unprocessed).toHaveLength(2);
            expect(unprocessed.some((m) => m.id.equals(message1.id))).toBe(true);
            expect(unprocessed.some((m) => m.id.equals(message2.id))).toBe(true);
        });

        it('deletes all stored messages in the outbox', () => {
            const repository = new InMemoryOutboxRepository();
            const message1 = OutboxMessageMother.playerJoined();
            const message2 = OutboxMessageMother.playerLeft();
            repository.save(message1);
            repository.save(message2);

            repository.findUnprocessed();

            expect(repository.findUnprocessed()).toHaveLength(0);
        });

        it('returns an empty array when no messages are stored', () => {
            const repository = new InMemoryOutboxRepository();

            const unprocessed = repository.findUnprocessed();

            expect(unprocessed).toHaveLength(0);
        });
    });

    describe('delete', () => {
        it('removes a message from the repository', () => {
            const repository = new InMemoryOutboxRepository();
            const message = OutboxMessageMother.any();
            repository.save(message);

            repository.delete(message.id);

            const unprocessed = repository.findUnprocessed();
            expect(unprocessed).toHaveLength(0);
        });

        it('does not affect other messages', () => {
            const repository = new InMemoryOutboxRepository();
            const message1 = OutboxMessageMother.playerJoined();
            const message2 = OutboxMessageMother.playerLeft();
            repository.save(message1);
            repository.save(message2);

            repository.delete(message1.id);

            const unprocessed = repository.findUnprocessed();
            expect(unprocessed).toHaveLength(1);
            expect(unprocessed[0].id.equals(message2.id)).toBe(true);
        });
    });
});
