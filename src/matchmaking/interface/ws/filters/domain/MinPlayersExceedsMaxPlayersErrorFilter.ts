import { MinPlayersExceedsMaxPlayersError } from '#matchmaking/domain/lobby/errors/MinPlayersExceedsMaxPlayersError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(MinPlayersExceedsMaxPlayersError)
export class MinPlayersExceedsMaxPlayersErrorFilter implements WsExceptionFilter<MinPlayersExceedsMaxPlayersError> {
    readonly code: string = 'MIN_PLAYERS_EXCEEDS_MAX_PLAYERS';

    catch(exception: MinPlayersExceedsMaxPlayersError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}
