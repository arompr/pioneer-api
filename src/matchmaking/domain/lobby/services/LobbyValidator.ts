import { LobbyFullError } from '../errors/LobbyFullError';
import { LobbyNotReadyToStartError } from '../errors/LobbyNotReadyToStartError';
import { PlayerIsNotHostError } from '../errors/PlayerIsNotHostError';
import { LobbyAggregate } from '../LobbyAggregate.type';
import { PlayerId } from '#common/domain/player/playerId/PlayerId';
import type { MatchmakingGameConfig } from '../../gateway/GameGateway';

/**
 * Pure domain service that enforces lobby business rules
 * that depend on the matchmaking game configuration (min/max players).
 */
export class LobbyValidator {
    /**
     * Asserts that a new player can join the lobby.
     *
     * @param {LobbyAggregate} lobby - The lobby to validate.
     * @param {MatchmakingGameConfig} config - The matchmaking game configuration.
     * @throws {LobbyFullError} If the lobby has reached its maximum player capacity.
     */
    assertCanJoin(lobby: LobbyAggregate, config: MatchmakingGameConfig): void {
        if (lobby.playerCount >= config.maxPlayers) {
            throw new LobbyFullError(lobby.id);
        }
    }

    /**
     * Asserts that the lobby meets the minimum requirements to start a match.
     *
     * @param {LobbyAggregate} lobby - The lobby to validate.
     * @param {MatchmakingGameConfig} config - The matchmaking game configuration.
     * @throws {LobbyNotReadyToStartError} If player count is below the minimum or any player is not ready.
     */
    assertMeetsRequirementsToStart(lobby: LobbyAggregate, config: MatchmakingGameConfig): void {
        if (
            lobby.playerCount < config.minPlayers ||
            !lobby.allPlayers.every((player) => player.isReady())
        ) {
            throw new LobbyNotReadyToStartError(lobby.id);
        }
    }

    /**
     * Asserts that the actor can start the match.
     *
     * @param {LobbyAggregate} lobby - The lobby to validate.
     * @param {MatchmakingGameConfig} config - The matchmaking game configuration.
     * @param {PlayerId} actor - The player attempting to start the match.
     * @throws {PlayerIsNotHostError} If the actor is not the host.
     * @throws {LobbyNotReadyToStartError} If the lobby does not meet the start requirements.
     */
    assertCanStart(lobby: LobbyAggregate, config: MatchmakingGameConfig, actor: PlayerId): void {
        if (!lobby.isHost(actor)) {
            throw new PlayerIsNotHostError(actor, lobby.id);
        }
        this.assertMeetsRequirementsToStart(lobby, config);
    }
}
