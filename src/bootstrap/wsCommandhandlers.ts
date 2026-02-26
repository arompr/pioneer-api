import { WsCommandDispatcher } from '#matchmaking/interface/ws/command/WsCommandDispatcher';
import { WsLobbyCommandType } from '#matchmaking/interface/ws/command/WsLobbyCommandType';
import { MarkReadyCommandHandler } from '#matchmaking/interface/ws/handlers/MarkReadyCommandHandler';
import { SyncPlayerCommandHandler } from '#matchmaking/interface/ws/handlers/SyncPlayerCommandHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';

export function registerWsHandlers(
    commandDispatcher: WsCommandDispatcher,
    markReadyUseCase: MarkReadyUseCase,
    getLobbyUseCase: GetLobbyUseCase,
    jwtTokenService: JwtTokenService
): void {
    commandDispatcher.register(
        WsLobbyCommandType.MARK_READY,
        new MarkReadyCommandHandler(markReadyUseCase)
    );

    commandDispatcher.register(
        WsLobbyCommandType.SYNC_PLAYER,
        new SyncPlayerCommandHandler(getLobbyUseCase, jwtTokenService)
    );
}
