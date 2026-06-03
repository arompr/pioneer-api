import { PayloadDomainEvent } from '#common/domain/events/DomainEvent';

export type GameCreatedPayload = {
    gameId: string;
    playerIds: string[];
    boardSeed: number;
};

/**
 * Event emitted when a new game is created.
 */
export class GameCreated implements PayloadDomainEvent<GameCreatedPayload> {
    public readonly type = 'GameCreated';

    /**
     * The unique identifier for the game.
     */
    public readonly gameId: string;

    /**
     * The player IDs participating in the game.
     */
    public readonly playerIds: string[];

    public readonly payload: GameCreatedPayload;

    /**
     * The initial board configuration seed or identifier.
     */
    public readonly boardSeed: number;

    constructor(gameId: string, playerIds: string[], boardSeed: number) {
        this.gameId = gameId;
        this.playerIds = playerIds;
        this.boardSeed = boardSeed;
        this.payload = { gameId, playerIds, boardSeed };
    }
}
