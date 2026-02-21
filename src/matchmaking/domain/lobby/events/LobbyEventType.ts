/**
 * Value Object representing the type of a lobby domain event.
 */
export class LobbyEventType {
    static readonly PlayerJoinedLobby = new LobbyEventType('PlayerJoinedLobby');
    static readonly PlayerLeftLobby = new LobbyEventType('PlayerLeftLobby');
    static readonly LobbyClosed = new LobbyEventType('LobbyClosed');
    static readonly LobbyHostChanged = new LobbyEventType('LobbyHostChanged');
    static readonly LobbyStarted = new LobbyEventType('LobbyStarted');
    static readonly PlayerMarkedPending = new LobbyEventType('PlayerMarkedPending');
    static readonly PlayerMarkedReady = new LobbyEventType('PlayerMarkedReady');

    private constructor(public readonly value: string) {}
}
