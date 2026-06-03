import { describe, it, expect, beforeEach } from 'vitest';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { LobbyAggregate } from '#matchmaking/domain/lobby/LobbyAggregate.type';
import { InMemoryLobbyRepository } from '#matchmaking/infrastructure/db/inMemory/lobby/InMemoryLobbyRepository';

let repo: InMemoryLobbyRepository;
let lobby: LobbyAggregate;

describe('InMemoryLobbyRepository', () => {
    beforeEach(() => {
        repo = new InMemoryLobbyRepository();
        lobby = LobbyMother.baseLobby().lobby;
    });

    describe('save', () => {
        describe('when saving a lobby', () => {
            it('stores it in memory', () => {
                repo.save(lobby);

                const found = repo.findById(lobby.id);

                expect(found).not.toBeNull();
                expect(found?.id.equals(lobby.id)).toBe(true);
            });
        });
    });

    describe('findById', () => {
        describe('when the lobby does not exist', () => {
            it('returns null', () => {
                const found = repo.findById(lobby.id);

                expect(found).toBeNull();
            });
        });

        describe('when the lobby exists', () => {
            beforeEach(() => {
                repo.save(lobby);
            });

            it('returns the stored lobby', () => {
                const found = repo.findById(lobby.id);

                expect(found).not.toBeNull();
                expect(found?.id.equals(lobby.id)).toBe(true);
            });
        });
    });

    describe('delete', () => {
        describe('when the lobby exists', () => {
            beforeEach(() => {
                repo.save(lobby);
            });

            it('removes it from memory', () => {
                repo.delete(lobby.id);

                const found = repo.findById(lobby.id);
                expect(found).toBeNull();
            });
        });

        describe('when the lobby does not exist', () => {
            it('does nothing and does not throw', () => {
                repo.delete(lobby.id);

                const found = repo.findById(lobby.id);
                expect(found).toBeNull();
            });
        });
    });
});
