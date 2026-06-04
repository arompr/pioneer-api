import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyMapper } from '#matchmaking/interface/ws/mapper/LobbyMapper';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { beforeEach, describe, expect, it } from 'vitest';

let lobby: Lobby;
let player1: Player;

describe('LobbyMapper', () => {
    beforeEach(() => {
        const { lobby: l, players } = LobbyMother.baseLobby();
        lobby = l;
        player1 = players[0];
    });

    describe('toLobbyResponse', () => {
        it('should map LobbyPlayerAggregate to LobbyResponse', () => {
            const lobbyWsResponse = LobbyMapper.toLobbyWsResponse(lobby);

            const playerResponse = lobbyWsResponse.players[0];
            expect(lobbyWsResponse.id).toBe(lobby.id.value);
            expect(lobbyWsResponse.status).toBe(lobby.stateType);
            expect(lobbyWsResponse.players).toHaveLength(lobby.allPlayers.length);
            expect(lobbyWsResponse.gameConfigId).toBe(lobby.gameConfigId.value);
            expect(playerResponse.id).toBe(player1.id.value);
            expect(playerResponse.name).toBe(player1.name);
            expect(playerResponse.isHost).toBe(lobby.isHost(player1.id));
            expect(playerResponse.status).toBe(lobby.findPlayer(player1.id).status);
        });
    });
});
