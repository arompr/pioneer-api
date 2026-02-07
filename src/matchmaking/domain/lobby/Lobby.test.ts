import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from './Lobby';
import { Player } from '../player/Player';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';

let lobby: Lobby;
let player1: Player;
let player2: Player;
let player3: Player;

describe('Lobby', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.baseLobby();
        lobby = l;
        [player1, player2, player3] = players;
    });

    describe('creation', () => {
        describe('when Lobby is created', () => {
            it('the lobby players are set', () => {
                expect(lobby.playerCount).toBe(1);
            });

            it('has the provided ID', () => {
                expect(lobby.getId()).toBe(LobbyMother.DEFAULT_LOBBY_ID);
            });
        });
    });

    describe('leave()', () => {
        describe('when the player is in the lobby', () => {
            it('removes the player from the lobby', () => {
                lobby.leave(player1.getSecretId());

                expect(lobby.isEmpty()).toBe(true);
                expect(lobby.playerCount).toBe(0);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                console.log(player1);
                expect(() => {
                    lobby.leave(player2.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });

        describe('when the host leaves', () => {
            it('transfers the host role to the next player', () => {
                lobby.join(player2);

                lobby.leave(player1.getSecretId());

                expect(lobby.isHost(player2.getSecretId())).toBe(true);
            });
        });

        describe('when a non-host player leaves', () => {
            it('does not change the host', () => {
                lobby.join(player2);

                lobby.leave(player2.getSecretId());

                expect(lobby.isHost(player1.getSecretId())).toBe(true);
            });
        });

        describe('when the host leaves and no players remain', () => {
            it('closes the lobby', () => {
                lobby.leave(player1.getSecretId());

                expect(lobby.isEmpty()).toBe(true);
            });
        });
    });

    describe('isHost()', () => {
        describe('when the lobby is empty', () => {
            it('returns false', () => {
                setupClosedLobby();

                expect(lobby.isHost(player1.getSecretId())).toBe(false);
            });
        });

        describe('when the player is the first to join', () => {
            it('returns true', () => {
                expect(lobby.isHost(player1.getSecretId()));
            });
        });

        describe('when the player is not the first to join', () => {
            it('returns false', () => {
                lobby.join(player2);

                expect(lobby.isHost(player2.getSecretId()));
            });
        });

        describe('when the player is not in the lobby', () => {
            it('returns false', () => {
                expect(lobby.isHost(player2.getSecretId())).toBe(false);
            });
        });
    });

    describe('isFull()', () => {
        describe('when the lobby has reached max capacity', () => {
            it('returns true', () => {
                lobby.join(player2);
                lobby.join(player3);

                expect(lobby.isFull()).toBe(true);
            });
        });

        describe('when the lobby is not as max capacity', () => {
            it('returns false', () => {
                expect(lobby.isFull()).toBe(false);
            });
        });

        describe('when a player leaves a full lobby', () => {
            it('returns false again', () => {
                lobby.join(player2);
                lobby.join(player3);

                lobby.leave(player1.getSecretId());

                expect(lobby.isFull()).toBe(false);
            });
        });
    });

    describe('isEmpty()', () => {
        describe('when there is no player in the lobby', () => {
            it('returns true', () => {
                setupClosedLobby();

                expect(lobby.isEmpty()).toBe(true);
            });
        });

        describe('when the lobby contains at least one player', () => {
            it('returns false', () => {
                expect(lobby.isEmpty()).toBe(false);
            });
        });

        describe('when the last player leave the lobby', () => {
            it('returns false again', () => {
                lobby.leave(player1.getSecretId());

                expect(lobby.isEmpty()).toBe(true);
            });
        });
    });

    describe('hasReachedMinimum()', () => {
        describe('when the number of ready players exactly reaches the minimum', () => {
            it('returns true', () => {
                lobby.join(player2);

                expect(lobby.hasReachedMinimum()).toBe(true);
            });
        });

        describe('when the number of players is below the minimum', () => {
            it('returns true', () => {
                expect(lobby.hasReachedMinimum()).toBe(false);
            });
        });

        describe('when the number of players exceeds the minimum', () => {
            it('returns true', () => {
                lobby.join(player2);
                lobby.join(player3);

                expect(lobby.hasReachedMinimum()).toBe(true);
            });
        });
    });

    describe('remainingPlaces()', () => {
        describe('when the lobby is empty', () => {
            it('returns the maximum capacity', () => {
                setupClosedLobby();

                expect(lobby.remainingPlaces()).toBe(LobbyMother.DEFAULT_MAX_PLAYERS);
            });
        });

        describe('when players join the lobby', () => {
            it('decreases the count of remaining places', () => {
                expect(lobby.remainingPlaces()).toBe(LobbyMother.DEFAULT_MAX_PLAYERS - 1);
            });
        });

        describe('when the lobby is full', () => {
            it('returns zero', () => {
                lobby.join(player2);
                lobby.join(player3);

                expect(lobby.remainingPlaces()).toBe(0);
            });
        });

        describe('when a player leaves', () => {
            it('inscreases the count of remaining place again', () => {
                lobby.join(player2);
                lobby.join(player3);

                lobby.leave(player3.getSecretId());

                expect(lobby.remainingPlaces()).toBe(1);
            });
        });
    });

    describe('allPlayers()', () => {
        describe('when there are players in the lobby', () => {
            it('returns a list of all the players', () => {
                lobby.join(player2);

                const players = lobby.allPlayers;

                expect(players).toHaveLength(2);
                expect(players).toContain(player1);
                expect(players).toContain(player2);
            });
        });

        describe('when the lobby is empty', () => {
            it('returns an empty list of players', () => {
                setupClosedLobby();

                expect(lobby.allPlayers).toEqual([]);
                expect(lobby.allPlayers).toHaveLength(0);
            });
        });
    });

    describe('playerCount()', () => {
        describe('when there are players in the lobby', () => {
            it('returns the number of player', () => {
                lobby.join(player2);

                expect(lobby.playerCount).toBe(2);
            });
        });

        describe('when a player leaves', () => {
            it('decreases the count', () => {
                lobby.join(player2);

                lobby.leave(player1.getSecretId());

                expect(lobby.playerCount).toBe(1);
            });
        });

        describe('when the lobby is empty', () => {
            it('returns zero', () => {
                lobby.leave(player1.getSecretId());

                expect(lobby.playerCount).toBe(0);
            });
        });
    });
});

const setupClosedLobby = () => {
    lobby.leave(player1.getSecretId());
};
