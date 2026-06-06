import { beforeEach, describe, expect, it } from 'vitest';
import { LobbyValidator } from '#matchmaking/domain/lobby/services/LobbyValidator';
import { LobbyFullError } from '#matchmaking/domain/lobby/errors/LobbyFullError';
import { LobbyNotReadyToStartError } from '#matchmaking/domain/lobby/errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '#matchmaking/domain/lobby/errors/PlayerIsNotHostError';
import { LobbyMother } from '#test/matchmaking/domain/lobby/LobbyMother';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import type { MatchmakingGameConfig } from '#matchmaking/domain/gateway/GameGateway';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;
const config: MatchmakingGameConfig = { minPlayers: MIN_PLAYERS, maxPlayers: MAX_PLAYERS };

let validator: LobbyValidator;

describe('LobbyValidator', () => {
    beforeEach(() => {
        validator = new LobbyValidator();
    });

    describe('assertCanJoin', () => {
        describe('when player count is below max', () => {
            it('does not throw', () => {
                const { lobby } = LobbyMother.baseLobby();

                expect(() => validator.assertCanJoin(lobby, config)).not.toThrow();
            });
        });

        describe('when player count equals max', () => {
            it('throws LobbyFullError', () => {
                const { lobby } = LobbyMother.readyToStartLobby();
                const fullConfig: MatchmakingGameConfig = {
                    minPlayers: MIN_PLAYERS,
                    maxPlayers: 2,
                };

                expect(() => validator.assertCanJoin(lobby, fullConfig)).toThrow(LobbyFullError);
            });
        });

        describe('when player count exceeds max', () => {
            it('throws LobbyFullError', () => {
                const { lobby } = LobbyMother.readyToStartLobby();
                const tightConfig: MatchmakingGameConfig = {
                    minPlayers: MIN_PLAYERS,
                    maxPlayers: 1,
                };

                expect(() => validator.assertCanJoin(lobby, tightConfig)).toThrow(LobbyFullError);
            });
        });
    });

    describe('assertMeetsRequirementsToStart', () => {
        describe('when player count is below min', () => {
            it('throws LobbyNotReadyToStartError', () => {
                const { lobby } = LobbyMother.baseLobby();

                expect(() => validator.assertMeetsRequirementsToStart(lobby, config)).toThrow(
                    LobbyNotReadyToStartError
                );
            });
        });

        describe('when not all players are ready', () => {
            it('throws LobbyNotReadyToStartError', () => {
                const { lobby } = LobbyMother.baseLobby();
                const relaxedConfig: MatchmakingGameConfig = {
                    minPlayers: 1,
                    maxPlayers: MAX_PLAYERS,
                };

                expect(() =>
                    validator.assertMeetsRequirementsToStart(lobby, relaxedConfig)
                ).toThrow(LobbyNotReadyToStartError);
            });
        });

        describe('when min players met and all ready', () => {
            it('does not throw', () => {
                const { lobby } = LobbyMother.readyToStartLobby();

                expect(() => validator.assertMeetsRequirementsToStart(lobby, config)).not.toThrow();
            });
        });
    });

    describe('assertCanStart', () => {
        describe('when actor is not the host', () => {
            it('throws PlayerIsNotHostError', () => {
                const { lobby, players } = LobbyMother.readyToStartLobby();
                const nonHost = new PlayerId(players[1].id.value);

                expect(() => validator.assertCanStart(lobby, config, nonHost)).toThrow(
                    PlayerIsNotHostError
                );
            });
        });

        describe('when actor is host but requirements are not met', () => {
            it('throws LobbyNotReadyToStartError', () => {
                const { lobby } = LobbyMother.baseLobby();
                const host = new PlayerId(lobby.hostId.value);

                expect(() => validator.assertCanStart(lobby, config, host)).toThrow(
                    LobbyNotReadyToStartError
                );
            });
        });

        describe('when actor is host and requirements are met', () => {
            it('does not throw', () => {
                const { lobby } = LobbyMother.readyToStartLobby();
                const host = new PlayerId(lobby.hostId.value);

                expect(() => validator.assertCanStart(lobby, config, host)).not.toThrow();
            });
        });
    });
});
