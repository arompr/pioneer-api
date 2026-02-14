import { PrivatePlayerMapper } from '#matchmaking/interface/http/lobby/mapper/PrivatePlayerMapper';
import { PlayerMother } from '#test/matchmaking/domain/player/PlayerMother';
import { describe, expect, it } from 'vitest';

describe('PrivatePlayerMapper', () => {
    describe('toPlayerResponse', () => {
        it('should map Player to PrivatePlayerResponse', () => {
            const player = PlayerMother.anyPlayer();

            const response = PrivatePlayerMapper.toPlayerResponse(player, true);

            expect(response).toEqual({
                secretKey: player.id.toString(),
                publicKey: player.publicKey.toString(),
                name: player.name,
                isHost: true,
            });
        });
    });
});
