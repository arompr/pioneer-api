import { WsCommandDispatcher } from '#matchmaking/interface/ws/command/WsCommandDispatcher';
import { WsCommandType } from '#matchmaking/interface/ws/command/WsCommandType';
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
        WsCommandType.MARK_READY,
        new MarkReadyCommandHandler(markReadyUseCase)
    );

    commandDispatcher.register(
        WsCommandType.SYNC_PLAYER,
        new SyncPlayerCommandHandler(getLobbyUseCase)
    );
}
