import { InMemoryOutboxRepository } from '#matchmaking/infastructure/db/inMemory/outbox/InMemoryOutboxRepository';
import { OutboxMessage } from '#matchmaking/domain/outbox/OutboxMessage';
import { OutboxMessageId } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageId';
import { OutboxObserver } from '#matchmaking/domain/outbox/OutboxObserver';
import { describe, expect, it, vi } from 'vitest';

describe('InMemoryOutboxRepository', () => {
    describe('save', () => {
        it('stores a message in the repository', () => {
            const repository = new InMemoryOutboxRepository();
            const message = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJK'),
                'PlayerJoinedLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );

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
            const message = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJK'),
                'PlayerJoinedLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );

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
            const message = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJK'),
                'PlayerJoinedLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );

            repository.save(message);

            expect(onMessagesAddedMock1).toHaveBeenCalledOnce();
            expect(onMessagesAddedMock2).toHaveBeenCalledOnce();
        });
    });

    describe('findUnprocessed', () => {
        it('returns all stored messages', () => {
            const repository = new InMemoryOutboxRepository();
            const message1 = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJK'),
                'PlayerJoinedLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );
            const message2 = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJL'),
                'PlayerLeftLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );
            repository.save(message1);
            repository.save(message2);

            const unprocessed = repository.findUnprocessed();

            expect(unprocessed).toHaveLength(2);
            expect(unprocessed.some((m) => m.id.equals(message1.id))).toBe(true);
            expect(unprocessed.some((m) => m.id.equals(message2.id))).toBe(true);
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
            const message = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJK'),
                'PlayerJoinedLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );
            repository.save(message);

            repository.delete(message.id);

            const unprocessed = repository.findUnprocessed();
            expect(unprocessed).toHaveLength(0);
        });

        it('does not affect other messages', () => {
            const repository = new InMemoryOutboxRepository();
            const message1 = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJK'),
                'PlayerJoinedLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );
            const message2 = new OutboxMessage(
                new OutboxMessageId('01JH9ABCDEFGHIJL'),
                'PlayerLeftLobby',
                { lobbyId: 'lobby-123' },
                new Date(),
                'lobby-123'
            );
            repository.save(message1);
            repository.save(message2);

            repository.delete(message1.id);

            const unprocessed = repository.findUnprocessed();
            expect(unprocessed).toHaveLength(1);
            expect(unprocessed[0].id.equals(message2.id)).toBe(true);
        });
    });
});
