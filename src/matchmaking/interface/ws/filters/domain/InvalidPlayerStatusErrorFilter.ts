import { InvalidPlayerStatusError } from '#matchmaking/domain/player/errors/InvalidPlayerStatusError';
import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';

@Catch(InvalidPlayerStatusError)
export class InvalidPlayerStatusErrorFilter implements WsExceptionFilter<InvalidPlayerStatusError> {
    readonly code: string = 'INVALID_PLAYER_STATUS';

    catch(exception: InvalidPlayerStatusError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}
