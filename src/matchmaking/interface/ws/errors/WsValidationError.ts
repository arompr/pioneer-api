import { ValidationErrorFormatted } from '#common/interface/ws/validation-error.util';
import { WsError } from './WsError';

export class WsValidationError extends WsError {
    constructor(public readonly details: ValidationErrorFormatted[]) {
        super(`Validation error'`);
    }
}
