import { ValidationErrorFormatted } from '../command/WsCommandDispatcher';
import { WsError } from './WsError';

export class WsValidationError extends WsError {
    constructor(public readonly details: ValidationErrorFormatted[]) {
        super(`Validation error'`);
    }
}
