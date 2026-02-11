import { InvalidLobbyStateError } from '../errors/InvalidLobbyStateError';
import { ClosedState } from './ClosedState';
import { InGameState } from './InGameState';
import { LobbyState } from './LobbyState';
import { LobbyStateType } from './LobbyStateType';
import { ReadyToStartState } from './ReadyToStartState';
import { WaitingForPlayersState } from './WaitingForPlayersState';

export class LobbyStateRegistry {
    private static readonly registry = new Map<LobbyStateType, new () => LobbyState>([
        [LobbyStateType.WaitingForPlayers, WaitingForPlayersState],
        [LobbyStateType.ReadyToStart, ReadyToStartState],
        [LobbyStateType.InGame, InGameState],
        [LobbyStateType.Closed, ClosedState],
    ]);

    static fromString(value: string): LobbyState {
        const type = value as LobbyStateType;
        const StateClass = this.registry.get(type);
        if (!StateClass) {
            throw new InvalidLobbyStateError(type);
        }
        return new StateClass();
    }
}
