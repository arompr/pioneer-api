import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { OutboxMessageFactory } from '#matchmaking/domain/outbox/OutboxMessageFactory';
import { OutboxRepository } from '#matchmaking/domain/outbox/OutboxRepository';
import { OutboxMessageIdFactory } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageIdFactory';
import { LobbyDomainEventSerializer } from '#matchmaking/infrastructure/serializer/LobbyDomainEventSerializer';
import type { Lobby } from '#matchmaking/domain/lobby/Lobby';
import type { Player } from '#matchmaking/domain/player/Player';
import { LobbyJoinRules } from '#matchmaking/domain/lobby/LobbyRules';

let outboxService: OutboxService;
let outboxRepository: Partial<OutboxRepository>;
let lobby: Lobby;
let player2: Player;

describe('OutboxService', () => {
    beforeEach(() => {
        outboxRepository = {
            save: vi.fn(),
            saveAll: vi.fn(),
            findUnprocessed: vi.fn(),
            delete: vi.fn(),
        };

        const outboxMessageFactory = new OutboxMessageFactory(new OutboxMessageIdFactory());
        outboxService = new OutboxService(
            outboxRepository as OutboxRepository,
            outboxMessageFactory,
            new LobbyDomainEventSerializer()
        );

        const { lobby: createdLobby, players } = LobbyMother.baseLobby();
        lobby = createdLobby;
        [, player2] = players;
    });

    describe('publishEvents', () => {
        describe('when the aggregate has domain events', () => {
            it('saves one outbox message per domain event', () => {
                const joinRules = new LobbyJoinRules(2, 4);
                lobby.join(player2, joinRules);
                lobby.leave(player2.id);

                outboxService.publishEvents(lobby);

                expect(outboxRepository.saveAll).toHaveBeenCalledWith([
                    expect.objectContaining({
                        eventType: 'PlayerJoinedLobby',
                        aggregateId: lobby.id,
                    }),
                    expect.objectContaining({
                        eventType: 'PlayerLeftLobby',
                        aggregateId: lobby.id,
                    }),
                ]);
            });
        });

        describe('when the aggregate has no domain events', () => {
            it('calls saveAll with an empty array', () => {
                outboxService.publishEvents(lobby);

                expect(outboxRepository.saveAll).toHaveBeenCalledWith([]);
            });
        });
    });
});
