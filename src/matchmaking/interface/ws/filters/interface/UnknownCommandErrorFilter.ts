import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { LobbySocket } from '../../LobbyGatewayWs';
import { WsEvents } from '../../WsEventsType';
import { UnknownCommandError } from '../../errors/UnknownCommandError';

@Catch(UnknownCommandError)
export class UnknownCommandErrorFilter implements WsExceptionFilter<UnknownCommandError> {
    readonly code: string = 'UNKNOWN_COMMAND';

    catch(exception: UnknownCommandError, host: ArgumentsHost): void {
        const client = host.switchToWs().getClient<LobbySocket>();

        client.emit(WsEvents.EXCEPTION, {
            code: this.code,
            message: exception.message,
            timestamp: new Date().toISOString(),
        });
    }
}
