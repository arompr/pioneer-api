import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { PlayerNotFoundInLobbyError } from '#matchmaking/domain/lobby/errors/PlayerNotFoundInLobbyError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { GameConfigId } from '#game/domain/config/GameConfigId';
import { PlayerJoinedLobby } from '#matchmaking/domain/lobby/events/PlayerJoinedLobby';
import { PlayerLeftLobby } from '#matchmaking/domain/lobby/events/PlayerLeftLobby';
import { LobbyClosed } from '#matchmaking/domain/lobby/events/LobbyClosed';
import { LobbyHostChanged } from '#matchmaking/domain/lobby/events/LobbyHostChanged';
import { LobbyStarted } from '#matchmaking/domain/lobby/events/LobbyStarted';
import { PlayerMarkedReady } from '#matchmaking/domain/lobby/events/PlayerMarkedReady';
import { PlayerMarkedPending } from '#matchmaking/domain/lobby/events/PlayerMarkedPending';

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
        describe('when Lobby is created without gameConfigId', () => {
            it('the lobby players are set', () => {
                expect(lobby.playerCount).toBe(1);
            });

            it('has the provided ID', () => {
                expect(lobby.id).toBe(LobbyMother.DEFAULT_LOBBY_ID);
            });

            it('gameConfigId is undefined', () => {
                expect(lobby.gameConfigId).toBeUndefined();
            });
        });

        describe('when Lobby is created with gameConfigId', () => {
            beforeEach(() => {
                const { lobby: l, players } = LobbyMother.baseLobbyWithGameConfigId();
                lobby = l;
                [player1, player2, player3] = players;
            });

            it('the lobby players are set', () => {
                expect(lobby.playerCount).toBe(1);
            });

            it('has the provided ID', () => {
                expect(lobby.id).toBe(LobbyMother.DEFAULT_LOBBY_ID);
            });

            it('gameConfigId is set to the provided value', () => {
                expect(lobby.gameConfigId).toBeDefined();
                expect(lobby.gameConfigId?.equals(LobbyMother.DEFAULT_GAME_CONFIG_ID)).toBe(true);
            });
        });

        describe('when Lobby is created with a specific gameConfigId', () => {
            it('gameConfigId matches the provided value', () => {
                const customGameConfigId = new GameConfigId('custom-game-config-id');
                const { lobby: customLobby } =
                    LobbyMother.baseLobbyWithGameConfigId(customGameConfigId);

                expect(customLobby.gameConfigId).toBeDefined();
                expect(customLobby.gameConfigId?.equals(customGameConfigId)).toBe(true);
            });
        });
    });

    describe('join', () => {
        describe('when a player joins', () => {
            it('emits PlayerJoinedLobby', () => {
                lobby.join(player2);

                expect(lobby.pullDomainEvents().some((e) => e instanceof PlayerJoinedLobby)).toBe(
                    true
                );
            });
        });
    });

    describe('leave', () => {
        describe('when the player is in the lobby', () => {
            it('removes the player from the lobby', () => {
                lobby.leave(player1.id);

                expect(lobby.isEmpty()).toBe(true);
                expect(lobby.playerCount).toBe(0);
            });

            it('emits PlayerLeftLobby', () => {
                lobby.leave(player1.id);

                expect(lobby.pullDomainEvents().some((e) => e instanceof PlayerLeftLobby)).toBe(
                    true
                );
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.leave(player2.id);
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });

        describe('when the host leaves', () => {
            beforeEach(() => {
                lobby.join(player2);
                lobby.leave(player1.id);
            });

            it('transfers the host role to the next player', () => {
                expect(lobby.isHost(player2.id)).toBe(true);
            });

            it('emits LobbyHostChanged', () => {
                expect(lobby.pullDomainEvents().some((e) => e instanceof LobbyHostChanged)).toBe(
                    true
                );
            });
        });

        describe('when a non-host player leaves', () => {
            it('does not change the host', () => {
                lobby.join(player2);

                lobby.leave(player2.id);

                expect(lobby.isHost(player1.id)).toBe(true);
            });
        });

        describe('when the host leaves and no players remain', () => {
            beforeEach(() => {
                lobby.leave(player1.id);
            });

            it('closes the lobby', () => {
                expect(lobby.isEmpty()).toBe(true);
            });

            it('emits LobbyClosed', () => {
                expect(lobby.pullDomainEvents().some((e) => e instanceof LobbyClosed)).toBe(true);
            });
        });
    });

    describe('start', () => {
        describe('when the host start the game', () => {
            it('emits LobbyStarted', () => {
                lobby = LobbyMother.readyToStartLobby().lobby;

                lobby.start(player1.id);

                expect(lobby.pullDomainEvents().some((e) => e instanceof LobbyStarted)).toBe(true);
            });
        });

        describe('when the host starts a game with gameConfigId', () => {
            it('emits LobbyStarted', () => {
                lobby = LobbyMother.readyToStartLobbyWithGameConfigId().lobby;

                lobby.start(player1.id);

                expect(lobby.pullDomainEvents().some((e) => e instanceof LobbyStarted)).toBe(true);
                expect(lobby.gameConfigId).toBeDefined();
            });
        });
    });

    describe('markAsReady', () => {
        describe('when a player in the lobby is marked ready', () => {
            it('emits PlayerMarkedReady', () => {
                lobby.markAsReady(player1.id);

                expect(lobby.pullDomainEvents().some((e) => e instanceof PlayerMarkedReady)).toBe(
                    true
                );
            });
        });
    });

    describe('markAsPending', () => {
        describe('when a player in the lobby is marked pending', () => {
            it('emits PlayerMarkedPending', () => {
                lobby.markAsPending(player1.id);

                expect(lobby.pullDomainEvents().some((e) => e instanceof PlayerMarkedPending)).toBe(
                    true
                );
            });
        });
    });

    describe('isHost', () => {
        describe('when the lobby is empty', () => {
            it('returns false', () => {
                setupClosedLobby();

                expect(lobby.isHost(player1.id)).toBe(false);
            });
        });

        describe('when the player is the first to join', () => {
            it('returns true', () => {
                expect(lobby.isHost(player1.id));
            });
        });

        describe('when the player is not the first to join', () => {
            it('returns false', () => {
                lobby.join(player2);

                expect(lobby.isHost(player2.id));
            });
        });

        describe('when the player is not in the lobby', () => {
            it('returns false', () => {
                expect(lobby.isHost(player2.id)).toBe(false);
            });
        });
    });

    describe('isFull', () => {
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

                lobby.leave(player1.id);

                expect(lobby.isFull()).toBe(false);
            });
        });
    });

    describe('isEmpty', () => {
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
                lobby.leave(player1.id);

                expect(lobby.isEmpty()).toBe(true);
            });
        });
    });

    describe('hasReachedMinimum', () => {
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

    describe('remainingPlaces', () => {
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

                lobby.leave(player3.id);

                expect(lobby.remainingPlaces()).toBe(1);
            });
        });
    });

    describe('allPlayers', () => {
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

    describe('playerCount', () => {
        describe('when there are players in the lobby', () => {
            it('returns the number of player', () => {
                lobby.join(player2);

                expect(lobby.playerCount).toBe(2);
            });
        });

        describe('when a player leaves', () => {
            it('decreases the count', () => {
                lobby.join(player2);

                lobby.leave(player1.id);

                expect(lobby.playerCount).toBe(1);
            });
        });

        describe('when the lobby is empty', () => {
            it('returns zero', () => {
                lobby.leave(player1.id);

                expect(lobby.playerCount).toBe(0);
            });
        });
    });

    describe('findPlayer', () => {
        describe('when the player is in the lobby', () => {
            it('returns the player', () => {
                const player = lobby.findPlayer(player1.id);

                expect(player).toBe(player1);
            });
        });
    });
});

const setupClosedLobby = () => {
    lobby.leave(player1.id);
};
