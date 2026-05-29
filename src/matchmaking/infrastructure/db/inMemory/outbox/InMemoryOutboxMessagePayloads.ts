export type PlayerJoinedLobbyPayload = { playerId: string };
export type PlayerLeftLobbyPayload = { playerId: string; wasHost: boolean };
export type LobbyHostChangedPayload = { newHostId: string };
export type PlayerMarkedPendingPayload = { playerId: string };
export type PlayerMarkedReadyPayload = { playerId: string };
