import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OutboxService } from '#matchmaking/domain/outbox/OutboxService';
import { OutboxMessageFactory } from '#matchmaking/domain/outbox/OutboxMessageFactory';
import { OutboxRepository } from '#matchmaking/domain/outbox/OutboxRepository';
import { OutboxMessageIdFactory } from '#matchmaking/domain/outbox/outboxMessageId/OutboxMessageIdFactory';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';

let outboxService: OutboxService;
let outboxRepository: Partial<OutboxRepository>;
let outboxMessageFactory: OutboxMessageFactory;
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
        outboxMessageFactory = new OutboxMessageFactory(new OutboxMessageIdFactory());
        outboxService = new OutboxService(
            outboxRepository as OutboxRepository,
            outboxMessageFactory
        );

        const result = LobbyMother.baseLobby();
        lobby = result.lobby;
        [, player2] = result.players;
    });

    describe('publishEvents', () => {
        describe('when the aggregate has domain events', () => {
            it('pulls all domain events from the aggregate', () => {
                lobby.join(player2);

                outboxService.publishEvents(lobby);

                expect(lobby.pullDomainEvents()).toHaveLength(0);
            });

            it('saves one outbox message per domain event', () => {
                lobby.join(player2);
                lobby.leave(player2.id);

                outboxService.publishEvents(lobby);

                expect(outboxRepository.saveAll).toHaveBeenCalledWith([
                    expect.objectContaining({ eventType: 'PlayerJoinedLobby' }),
                    expect.objectContaining({ eventType: 'PlayerLeftLobby' }),
                ]);
            });

            it('saves messages with the aggregate id', () => {
                lobby.join(player2);

                outboxService.publishEvents(lobby);

                expect(outboxRepository.saveAll).toHaveBeenCalledWith([
                    expect.objectContaining({ aggregateId: lobby.id.value }),
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
