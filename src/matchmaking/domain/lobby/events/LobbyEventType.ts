export const LobbyEventType = {
    PlayerJoinedLobby: 'PlayerJoinedLobby',
    PlayerLeftLobby: 'PlayerLeftLobby',
    LobbyClosed: 'LobbyClosed',
    LobbyHostChanged: 'LobbyHostChanged',
    LobbyStarted: 'LobbyStarted',
    PlayerMarkedPending: 'PlayerMarkedPending',
    PlayerMarkedReady: 'PlayerMarkedReady',
} as const;

export type LobbyEventType = keyof typeof LobbyEventType;
