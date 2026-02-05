import { beforeEach, describe, expect, it } from 'vitest';
import { LobbyId } from './lobbyId/LobbyId';
import { Lobby } from './Lobby';
import { LobbyConfig } from './LobbyConfig/LobbyConfig';
import { LobbyGameMode } from './LobbyConfig/LobbyGameMode';
import { LobbyStatus } from './LobbyStatus';
import { Player } from '../player/Player';
import { PlayerId } from '../player/playerId/PlayerId';
import { LobbyFullError } from './errors/LobbyFullError';
import { PlayerAlreadyInLobbyError } from './errors/PlayerAlreadyInLobbyError';
import { PlayerNotFoundInLobbyError } from './errors/PlayerNotFoundInLobbyError';
import { LobbyAlreadyInGameError } from './errors/LobbyAlreadyInGameError';
import { PlayerIsNotHostError } from './errors/PlayerIsNotHostError';
import { LobbyNotReadyToStartError } from './errors/LobbyNotReadyToStartError';
import { LobbyClosedError } from './errors/LobbyClosedError';
import { LobbyPlayers } from './LobbyPlayers';

const LOBBY_ID = new LobbyId('lobby-id');
const LOBBY_MIN_CAPACITY = 2;
const LOBBY_MAX_CAPACITY = 3;
const LOBBY_CONFIG = new LobbyConfig(LobbyGameMode.BASE, LOBBY_MIN_CAPACITY, LOBBY_MAX_CAPACITY);

let lobby: Lobby;
let players: LobbyPlayers;
let player1: Player;
let player2: Player;
let player3: Player;
let player4: Player;

describe('Lobby', () => {
    beforeEach(() => {
        player1 = createPlayer('1');
        player2 = createPlayer('2');
        player3 = createPlayer('3');
        player4 = createPlayer('4');

        players = new LobbyPlayers();
        players.add(player1);
        lobby = new Lobby(LOBBY_ID, LOBBY_CONFIG, player1.getSecretId(), players, false, false);
    });

    describe('creation', () => {
        describe('when Lobby is created', () => {
            it('the lobby players are set', () => {
                expect(lobby.playerCount).toBe(players.count);
            });

            it('has the provided ID', () => {
                expect(lobby.getId()).toBe(LOBBY_ID);
            });
        });
    });

    describe('join()', () => {
        describe('when the lobby is not full', () => {
            it('adds the player in the lobby', () => {
                expect(lobby.playerCount).toBe(1);
                expect(lobby.allPlayers).toContain(player1);
            });
        });

        describe('when the lobby if full ', () => {
            it('throws LobbyFullError', () => {
                lobby.join(player2);
                lobby.join(player3);

                expect(() => {
                    lobby.join(player4);
                }).toThrow(LobbyFullError);
            });
        });

        describe('when the player in already in the lobby', () => {
            it('throws PlayerAlreadyInLobbyError', () => {
                expect(() => {
                    lobby.join(player1);
                }).toThrow(PlayerAlreadyInLobbyError);
            });
        });

        describe('when the lobby is closed', () => {
            it('throws LobbyClosedError', () => {
                setupClosedLobby();

                expect(() => {
                    lobby.join(player1);
                }).toThrow(LobbyClosedError);
            });
        });

        describe('when the lobby is in game', () => {
            it('throws LobbyAlreadyStartedError', () => {
                setupStartedGame();

                console.log(lobby);

                expect(() => {
                    lobby.join(player3);
                }).toThrow(LobbyAlreadyInGameError);
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

                expect(lobby.status).toBe(LobbyStatus.CLOSED);
                expect(lobby.isEmpty()).toBe(true);
            });
        });
    });

    describe('start()', () => {
        describe('when the lobby is in game', () => {
            it('throws LobbyAlreadyStartedError', () => {
                setupStartedGame();

                expect(() => {
                    lobby.start(player1.getSecretId());
                }).toThrow(LobbyAlreadyInGameError);
            });
        });

        describe('when the lobby is closed', () => {
            it('throws LobbyClosedError', () => {
                setupClosedLobby();

                expect(() => {
                    lobby.start(player1.getSecretId());
                }).toThrow(LobbyClosedError);
            });
        });

        describe('when the lobby is not in game', () => {
            describe('when the player attempting to start is the host', () => {
                describe('when the minimum capacity is reached', () => {
                    describe('when all the players are ready', () => {
                        it('transitions the lobby to IN_GAME status', () => {
                            setupReadyLobby();

                            lobby.start(player1.getSecretId());

                            expect(lobby.status).toBe(LobbyStatus.IN_GAME);
                        });
                    });

                    describe('when at least one player is not ready', () => {
                        it('throws LobbyNotReadyToStartError', () => {
                            lobby.join(player2);
                            lobby.markAsReady(player1.getSecretId());

                            expect(() => {
                                lobby.start(player1.getSecretId());
                            }).toThrow(LobbyNotReadyToStartError);
                        });
                    });
                });

                describe('when the minimum capacity is not reached', () => {
                    it('throws LobbyNotReadyToStartError', () => {
                        lobby.markAsReady(player1.getSecretId());

                        expect(() => {
                            lobby.start(player1.getSecretId());
                        }).toThrow(LobbyNotReadyToStartError);
                    });
                });
            });

            describe('when the player attempting to start is not the host', () => {
                it('throws PlayerIsNotHostError', () => {
                    setupReadyLobby();

                    expect(() => {
                        lobby.start(player2.getSecretId());
                    }).toThrow(PlayerIsNotHostError);
                });
            });
        });
    });

    describe('markAsReady()', () => {
        describe('when the player is in the lobby', () => {
            it('contributes to the lobby becoming ready to start', () => {
                lobby.join(player2);

                lobby.markAsReady(player1.getSecretId());
                lobby.markAsReady(player2.getSecretId());

                expect(lobby.canStart()).toBe(true);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('updates the player status', () => {
                expect(() => {
                    lobby.markAsReady(player2.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });

        describe('when the lobby is closed', () => {
            it('throws LobbyClosedError', () => {
                setupClosedLobby();

                expect(() => {
                    lobby.markAsReady(player1.getSecretId());
                }).toThrow(LobbyClosedError);
            });
        });

        describe('when already in game', () => {
            it('throws LobbyAlreadyStartedError', () => {
                setupStartedGame();

                expect(() => {
                    lobby.markAsReady(player1.getSecretId());
                }).toThrow(LobbyAlreadyInGameError);
            });
        });
    });

    describe('markAsPending()', () => {
        describe('when a player who was ready becomes pending again', () => {
            it('is no longer ready to start', () => {
                setupReadyLobby();

                lobby.markAsPending(player1.getSecretId());

                expect(lobby.canStart()).toBe(false);
            });
        });

        describe('when the player is not in the lobby', () => {
            it('throws PlayerNotFoundInLobbyError', () => {
                expect(() => {
                    lobby.markAsPending(player2.getSecretId());
                }).toThrow(PlayerNotFoundInLobbyError);
            });
        });

        describe('when the lobby is closed', () => {
            it('throws LobbyClosedError', () => {
                setupClosedLobby();

                expect(() => {
                    lobby.markAsPending(player1.getSecretId());
                }).toThrow(LobbyClosedError);
            });
        });

        describe('when already in game', () => {
            it('throws LobbyAlreadyStartedError', () => {
                setupStartedGame();

                expect(() => {
                    lobby.markAsPending(player1.getSecretId());
                }).toThrow(LobbyAlreadyInGameError);
            });
        });
    });

    describe('canStart()', () => {
        describe('when there are enough players', () => {
            beforeEach(() => {
                lobby.join(player2);
            });

            describe('when they are all ready', () => {
                it('returns true', () => {
                    lobby.markAsReady(player1.getSecretId());
                    lobby.markAsReady(player2.getSecretId());

                    expect(lobby.canStart()).toBe(true);
                });
            });

            describe('when some are not ready', () => {
                it('returns false', () => {
                    lobby.markAsReady(player1.getSecretId());

                    expect(lobby.canStart()).toBe(false);
                });
            });
        });

        describe('when there are not enough players', () => {
            it('returns false', () => {
                lobby.markAsReady(player1.getSecretId());

                expect(lobby.canStart()).toBe(false);
            });
        });

        describe('when the game has already started', () => {
            it('returns false (it cannot be started again)', () => {
                setupStartedGame();
                expect(lobby.canStart()).toBe(false);
            });
        });
    });

    describe('isWaiting()', () => {
        describe('when at least one player is pending', () => {
            it('returns true', () => {
                expect(lobby.isWaiting()).toBe(true);
            });
        });

        describe('when minimum player is reached', () => {
            beforeEach(() => {
                lobby.join(player2);
            });

            describe('when at least one player is pending', () => {
                it('returns true', () => {
                    lobby.markAsReady(player1.getSecretId());

                    expect(lobby.isWaiting()).toBe(true);
                });
            });

            describe('when all player are ready', () => {
                it('returns false', () => {
                    lobby.markAsReady(player1.getSecretId());
                    lobby.markAsReady(player2.getSecretId());

                    expect(lobby.isWaiting()).toBe(false);
                });
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
        describe('when the number of players exactly reaches the minimum', () => {
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

                expect(lobby.remainingPlaces()).toBe(LOBBY_MAX_CAPACITY);
            });
        });

        describe('when players join the lobby', () => {
            it('decreases the count of remaining places', () => {
                expect(lobby.remainingPlaces()).toBe(LOBBY_MAX_CAPACITY - 1);
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

const createPlayer = (id: string) => {
    return new Player(new PlayerId(`secret-${id}`), new PlayerId(`public-${id}`), `player-${id}`);
};

const setupReadyLobby = () => {
    lobby.join(player2);
    lobby.markAsReady(player1.getSecretId());
    lobby.markAsReady(player2.getSecretId());
};

const setupStartedGame = () => {
    setupReadyLobby();
    lobby.start(player1.getSecretId());
};

const setupClosedLobby = () => {
    lobby.leave(player1.getSecretId());
};
