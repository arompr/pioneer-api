import { formatValidationErrors } from '#common/interface/ws/validation-error.util';
import { ValidationError } from '@nestjs/common';
import { describe, it, expect } from 'vitest';

describe('formatValidationErrors', () => {
    it('should map ValidationError to ValidationErrorFormatted', () => {
        const errors = [
            {
                property: 'name',
                constraints: {
                    isString: 'name must be a string',
                },
            },
            {
                property: 'age',
                constraints: {
                    isInt: 'age must be an integer',
                },
            },
        ] as ValidationError[];

        const result = formatValidationErrors(errors);

        expect(result).toEqual([
            {
                property: 'name',
                constraints: {
                    isString: 'name must be a string',
                },
            },
            {
                property: 'age',
                constraints: {
                    isInt: 'age must be an integer',
                },
            },
        ]);
    });
});
