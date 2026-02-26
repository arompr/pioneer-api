import { PrivatePlayerMapper } from '#matchmaking/interface/http/lobby/mapper/PrivatePlayerMapper';
import { PlayerMother } from '#test/matchmaking/domain/player/PlayerMother';
import { describe, expect, it } from 'vitest';

describe('PrivatePlayerMapper', () => {
    describe('toPlayerResponse', () => {
        it('should map Player to PrivatePlayerResponse', () => {
            const player = PlayerMother.anyPlayer();
            const token = 'mock-jwt-token';

            const response = PrivatePlayerMapper.toPlayerResponse(player, true, token);

            expect(response).toEqual({
                token,
                id: player.id.value,
                name: player.name,
                isHost: true,
            });
        });
    });
});
