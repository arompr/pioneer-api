import { DomainEvent } from '#common/domain/events/DomainEvent';

export type LobbyClosedPayload = {
    gameId: string;
    playerIds: string[];
    boardSeed: number;
};

/**
 * Event emitted when a new game is created.
 */
export class GameCreated implements DomainEvent<LobbyClosedPayload> {
    public readonly type = 'GameCreated';

    /**
     * The unique identifier for the game.
     */
    public readonly gameId: string;

    /**
     * The player IDs participating in the game.
     */
    public readonly playerIds: string[];

    payload: LobbyClosedPayload;

    /**
     * The initial board configuration seed or identifier.
     */
    public readonly boardSeed: number;

    constructor(gameId: string, playerIds: string[], boardSeed: number) {
        this.payload = { gameId, playerIds, boardSeed };
    }
}
