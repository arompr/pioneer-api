import { DomainEvent } from '#common/domain/events/DomainEvent';

/**
 * Event emitted when a new game is created.
 */
export class GameCreated extends DomainEvent {
    public readonly type = 'GameCreated';

    /**
     * The unique identifier for the game.
     */
    public readonly gameId: string;

    /**
     * The player IDs participating in the game.
     */
    public readonly playerIds: string[];

    /**
     * The initial board configuration seed or identifier.
     */
    public readonly boardSeed: number;

    constructor(gameId: string, playerIds: string[], boardSeed: number) {
        super();
        this.gameId = gameId;
        this.playerIds = playerIds;
        this.boardSeed = boardSeed;
    }
}
