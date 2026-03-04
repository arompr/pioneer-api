import { ValidationError } from 'class-validator';

export interface ValidationErrorFormatted {
    property: string;
    constraints?: Record<string, string>;
}

export function formatValidationErrors(errors: ValidationError[]): ValidationErrorFormatted[] {
    return errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
    }));
}
