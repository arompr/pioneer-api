import { z } from 'zod';

export const playerJoinedLobbyPayloadSchema = z.object({
    playerId: z.string(),
});

export const playerLeftLobbyPayloadSchema = z.object({
    playerId: z.string(),
    wasHost: z.boolean(),
});

export const lobbyHostChangedPayloadSchema = z.object({
    newHostId: z.string(),
});

export const playerMarkedPendingPayloadSchema = z.object({
    playerId: z.string(),
});

export const playerMarkedReadyPayloadSchema = z.object({
    playerId: z.string(),
});

export type PlayerJoinedLobbyPayload = z.infer<typeof playerJoinedLobbyPayloadSchema>;
export type PlayerLeftLobbyPayload = z.infer<typeof playerLeftLobbyPayloadSchema>;
export type LobbyHostChangedPayload = z.infer<typeof lobbyHostChangedPayloadSchema>;
export type PlayerMarkedPendingPayload = z.infer<typeof playerMarkedPendingPayloadSchema>;
export type PlayerMarkedReadyPayload = z.infer<typeof playerMarkedReadyPayloadSchema>;
