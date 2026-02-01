import { beforeEach, describe, expect, it } from 'vitest';
import { LobbyPlayers } from './LobbyPlayers.ts';
import { Player } from '../player/Player.ts';
import { PlayerId } from '../player/playerId/PlayerId.ts';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError.ts';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError.ts';

let player: Player;
let lobbyPlayers: LobbyPlayers;

beforeEach(() => {
    lobbyPlayers = new LobbyPlayers();
    player = new Player(new PlayerId('secret-id'), new PlayerId('public-id'), 'name');
});

describe('LobbyPlayers', () => {
    describe('creation', () => {
        describe('when lobbyPlayer is created', () => {
            it('is empty', () => {
                expect(lobbyPlayers.count).toBe(0);
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
            secondPlayer = new Player(
                new PlayerId('id-secret-2'),
                new PlayerId('id-public-2'),
                'Bob'
            );

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
});
