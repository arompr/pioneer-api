import { beforeEach, describe, expect, it } from 'vitest';
import { LobbyPlayers } from './LobbyPlayers';
import { Player } from '../player/Player';
import { PlayerId } from '../player/playerId/PlayerId';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError';

let player: Player;
let lobbyPlayers: LobbyPlayers;

beforeEach(() => {
    lobbyPlayers = new LobbyPlayers();
    player = createPlayer('1');
});

describe('LobbyPlayers', () => {
    describe('creation', () => {
        describe('when lobbyPlayer is created', () => {
            it('is empty', () => {
                expect(lobbyPlayers.isEmpty()).toBe(true);
            });
        });
    });

    describe('add()', () => {
        describe('when the player is not in the lobby players', () => {
            it('adds the player', () => {
                lobbyPlayers.add(player);

                expect(lobbyPlayers.count).toBe(1);
            });
        });

        describe('when the player is already present', () => {
            it('throws a PlayerAlreadyInLobbyError', () => {
                lobbyPlayers.add(player);

                expect(() => {
                    lobbyPlayers.add(player);
                }).toThrow(PlayerAlreadyInLobbyError);
            });
        });
    });

    describe('remove()', () => {
        describe('when the player is in the lobby players', () => {
            it('removes the player', () => {
                lobbyPlayers.add(player);

                lobbyPlayers.remove(player.getSecretId());

                expect(lobbyPlayers.count).toBe(0);
            });
        });

        describe('when the player is not in the lobby players', () => {
            it('throws a PlayerAlreadyInLobbyError', () => {
                expect(() => {
                    lobbyPlayers.remove(player.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('findById()', () => {
        describe('when the player exists in the lobby players', () => {
            it('returns the player matching the identifier', () => {
                lobbyPlayers.add(player);

                const foundPlayer = lobbyPlayers.findById(player.getSecretId());

                expect(foundPlayer).toBe(player);
            });
        });

        describe('when the player does not exist in the lobby players', () => {
            it('throws a PlayerNotFoundError', () => {
                const unknownId = new PlayerId('unknown');

                expect(() => lobbyPlayers.findById(unknownId)).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsReady()', () => {
        describe('when the player exists in the lobby', () => {
            it('updates the player status to ready', () => {
                lobbyPlayers.add(player);

                lobbyPlayers.markAsReady(player.getSecretId());

                expect(player.isReady()).toBe(true);
            });
        });

        describe('when the player does not exist in the lobby', () => {
            it('throws a PlayerNotFoundInLobbyError', () => {
                const unknownId = new PlayerId('unknown');

                expect(() => {
                    lobbyPlayers.markAsReady(unknownId);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('markAsPending()', () => {
        describe('when the player exists in the lobby', () => {
            it('updates the player status to pending', () => {
                lobbyPlayers.add(player);

                lobbyPlayers.markAsPending(player.getSecretId());

                expect(player.isReady()).toBe(false);
            });
        });

        describe('when the player does not exist in the lobby', () => {
            it('throws a PlayerNotFoundInLobbyError', () => {
                const unknownId = new PlayerId('unknown');

                expect(() => {
                    lobbyPlayers.markAsPending(unknownId);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('areAllReady()', () => {
        let secondPlayer: Player;

        beforeEach(() => {
            secondPlayer = createPlayer('2');
            lobbyPlayers.add(player);
            lobbyPlayers.add(secondPlayer);
        });

        describe('when all players are ready', () => {
            it('returns true', () => {
                lobbyPlayers.markAsReady(player.getSecretId());
                lobbyPlayers.markAsReady(secondPlayer.getSecretId());

                expect(lobbyPlayers.areAllReady()).toBe(true);
            });
        });

        describe('when at least one player is not ready', () => {
            it('returns false', () => {
                lobbyPlayers.markAsReady(player.getSecretId());

                expect(lobbyPlayers.areAllReady()).toBe(false);
            });
        });
    });

    describe('first()', () => {
        describe('when the lobby is not empty', () => {
            it('returns the first player added (the host)', () => {
                const secondPlayer = createPlayer('2');
                lobbyPlayers.add(player);
                lobbyPlayers.add(secondPlayer);

                const first = lobbyPlayers.first();

                expect(first).toBe(player);
                expect(first).not.toBe(secondPlayer);
            });
        });

        describe('when the lobby is empty', () => {
            it('throws a PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobbyPlayers.first();
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });
    });

    describe('contains()', () => {
        describe('when the player exists in the lobby players', () => {
            it('returns true', () => {
                lobbyPlayers.add(player);

                expect(lobbyPlayers.contains(player)).toBe(true);
            });
        });

        describe('when the player does not exist in the lobby players', () => {
            it('returns false', () => {
                expect(lobbyPlayers.contains(player)).toBe(false);
            });
        });
    });
});

const createPlayer = (id: string, name: string = 'Player') => {
    return new Player(new PlayerId(`secret-${id}`), new PlayerId(`public-${id}`), name);
};
