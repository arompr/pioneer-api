import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryLobbyRepository } from './InMemoryLobbyRepository';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';

let repo: InMemoryLobbyRepository;
let lobby: LobbyAggregate;

describe('InMemoryLobbyRepository', () => {
    beforeEach(() => {
        repo = new InMemoryLobbyRepository();
        lobby = LobbyMother.baseLobby().lobby;
    });

    describe('save()', () => {
        describe('when saving a lobby', () => {
            it('stores it in memory', async () => {
                await repo.save(lobby);

                const found = await repo.findById(lobby.id);

                expect(found).not.toBeNull();
                expect(found?.id.equals(lobby.id)).toBe(true);
            });
        });
    });

    describe('findById()', () => {
        describe('when the lobby does not exist', () => {
            it('returns null', async () => {
                const found = await repo.findById(lobby.id);

                expect(found).toBeNull();
            });
        });

        describe('when the lobby exists', () => {
            beforeEach(async () => {
                await repo.save(lobby);
            });

            it('returns the stored lobby', async () => {
                const found = await repo.findById(lobby.id);

                expect(found).not.toBeNull();
                expect(found?.id.equals(lobby.id)).toBe(true);
            });
        });
    });

    describe('delete()', () => {
        describe('when the lobby exists', () => {
            beforeEach(async () => {
                await repo.save(lobby);
            });

            it('removes it from memory', async () => {
                await repo.delete(lobby.id);

                const found = await repo.findById(lobby.id);
                expect(found).toBeNull();
            });
        });

        describe('when the lobby does not exist', () => {
            it('does nothing and does not throw', async () => {
                await repo.delete(lobby.id);

                const found = await repo.findById(lobby.id);
                expect(found).toBeNull();
            });
        });
    });
});
