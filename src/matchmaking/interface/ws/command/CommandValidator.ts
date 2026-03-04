import { WsCommand } from '#common/interface/ws/command/WsCommand';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { WsCommandHandler } from '#common/interface/ws/command/WsCommandHandler';
import { WsValidationError } from '../errors/WsValidationError';
import { formatValidationErrors } from '#common/interface/ws/validation-error.util';

export class CommandValidator {
    static async validate(handler: WsCommandHandler<WsCommand>, command: WsCommand): Promise<void> {
        if (handler.payloadValidationClass) {
            const payload = plainToInstance(handler.payloadValidationClass, command.payload);
            const errors = await validate(payload, {
                forbidUnknownValues: false,
            });

            if (errors.length > 0) {
                throw new WsValidationError(formatValidationErrors(errors));
            }
        }
    }
}
