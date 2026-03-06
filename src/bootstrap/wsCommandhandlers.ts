import { WsCommandDispatcher } from '#matchmaking/interface/ws/command/WsCommandDispatcher';
import { WsLobbyCommandType } from '#matchmaking/interface/ws/command/WsLobbyCommandType';
import { MarkReadyCommandHandler } from '#matchmaking/interface/ws/handlers/MarkReadyCommandHandler';
import { SyncPlayerCommandHandler } from '#matchmaking/interface/ws/handlers/SyncPlayerCommandHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';
import type { JwtTokenService } from '#matchmaking/domain/auth/JwtTokenService';
import { MarkPendingCommandHandler } from '#matchmaking/interface/ws/handlers/MarkPendingCommandHandler';
import { MarkPendingUseCase } from '#matchmaking/usecase/MarkPendingUseCase';

export function registerWsHandlers(
    commandDispatcher: WsCommandDispatcher,
    markReadyUseCase: MarkReadyUseCase,
    markPendingUseCase: MarkPendingUseCase,
    getLobbyUseCase: GetLobbyUseCase,
    jwtTokenService: JwtTokenService
): void {
    commandDispatcher.register(
        WsLobbyCommandType.MARK_READY,
        new MarkReadyCommandHandler(markReadyUseCase)
    );

    commandDispatcher.register(
        WsLobbyCommandType.MARK_PENDING,
        new MarkPendingCommandHandler(markPendingUseCase)
    );

    commandDispatcher.register(
        WsLobbyCommandType.SYNC_PLAYER,
        new SyncPlayerCommandHandler(getLobbyUseCase, jwtTokenService)
    );
}
