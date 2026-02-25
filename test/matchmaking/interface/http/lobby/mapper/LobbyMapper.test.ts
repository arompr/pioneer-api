import { Lobby } from '#matchmaking/domain/lobby/Lobby';
import { Player } from '#matchmaking/domain/player/Player';
import { LobbyMapper } from '#matchmaking/interface/http/lobby/mapper/LobbyMapper';
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
            const lobbyResponse = LobbyMapper.toLobbyResponse(lobby);

            const playerResponse = lobbyResponse.players[0];
            expect(lobbyResponse.id).toBe(lobby.id.value);
            expect(lobbyResponse.status).toBe(lobby.stateType);
            expect(lobbyResponse.players).toHaveLength(lobby.allPlayers.length);
            expect(playerResponse.publicKey).toBe(player1.publicKey.value);
            expect(playerResponse.name).toBe(player1.name);
            expect(playerResponse.status).toBe(player1.status);
            expect(playerResponse.isHost).toBe(lobby.isHost(player1.id));
        });
    });
});
