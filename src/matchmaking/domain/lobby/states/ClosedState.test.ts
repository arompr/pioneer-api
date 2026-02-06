import { beforeEach, describe, expect, it } from 'vitest';
import { Lobby } from '../Lobby';
import { LobbyPlayers } from '../LobbyPlayers';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyId } from '../lobbyId/LobbyId';
import { LobbyConfig } from '../LobbyConfig/LobbyConfig';
import { PlayerId } from '#matchmaking/domain/player/playerId/PlayerId';
import { LobbyGameMode } from '../LobbyConfig/LobbyGameMode';
import { ClosedState } from './ClosedState';
import { LobbyClosedError } from '../errors/LobbyClosedError';

const LOBBY_ID = new LobbyId('lobby-id');
const LOBBY_MIN_CAPACITY = 2;
const LOBBY_MAX_CAPACITY = 3;
const LOBBY_CONFIG = new LobbyConfig(LobbyGameMode.BASE, LOBBY_MIN_CAPACITY, LOBBY_MAX_CAPACITY);

let lobby: Lobby;
let players: LobbyPlayers;
let player1: Player;

describe('ClosedState', () => {
    beforeEach(() => {
        players = new LobbyPlayers();
        player1 = new Player(new PlayerId(`secret-1`), new PlayerId(`public-1`), `player-1`);
        players.add(player1);
        lobby = new Lobby(
            LOBBY_ID,
            LOBBY_CONFIG,
            player1.getSecretId(),
            players,
            new ClosedState()
        );
    });

    describe('join()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.join(player1);
            }).toThrow(LobbyClosedError);
        });
    });

    describe('start()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.start(player1.getSecretId());
            }).toThrow(LobbyClosedError);
        });
    });

    describe('markAsReady()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.markAsReady(player1.getSecretId());
            }).toThrow(LobbyClosedError);
        });
    });

    describe('markAsPending()', () => {
        it('throws LobbyClosedError', () => {
            expect(() => {
                lobby.markAsPending(player1.getSecretId());
            }).toThrow(LobbyClosedError);
        });
    });

    describe('canStart()', () => {
        it('returns false', () => {
            expect(lobby.canStart()).toBe(false);
        });
    });
});
