import { WsCommandDispatcher } from '#matchmaking/interface/ws/command/WsCommandDispatcher';
import { WsLobbyCommandType } from '#matchmaking/interface/ws/command/WsLobbyCommandType';
import { MarkReadyCommandHandler } from '#matchmaking/interface/ws/handlers/MarkReadyCommandHandler';
import { SyncPlayerCommandHandler } from '#matchmaking/interface/ws/handlers/SyncPlayerCommandHandler';
import { GetLobbyUseCase } from '#matchmaking/usecase/GetLobbyUseCase';
import { MarkReadyUseCase } from '#matchmaking/usecase/MarkReadyUseCase';

export function registerWsHandlers(
    commandDispatcher: WsCommandDispatcher,
    markReadyUseCase: MarkReadyUseCase,
    getLobbyUseCase: GetLobbyUseCase
): void {
    commandDispatcher.register(
        WsLobbyCommandType.MARK_READY,
        new MarkReadyCommandHandler(markReadyUseCase)
    );

    commandDispatcher.register(
        WsLobbyCommandType.SYNC_PLAYER,
        new SyncPlayerCommandHandler(getLobbyUseCase)
    );
}
