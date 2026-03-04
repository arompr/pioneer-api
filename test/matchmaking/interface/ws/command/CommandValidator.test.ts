import { IsString } from 'class-validator';
import { vi, describe, it, expect, afterEach } from 'vitest';
import * as classValidator from 'class-validator';
import { CommandValidator } from '#matchmaking/interface/ws/command/CommandValidator';
import { WsValidationError } from '#matchmaking/interface/ws/errors/WsValidationError';

class TestPayload {
    @IsString()
    name!: string;
}

const commandeHandler = {
    payloadValidationClass: TestPayload,
    handle: vi.fn(),
};

const commandeHandlerWithoutPayloadValidation = {
    handle: vi.fn(),
};

describe('CommandValidator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('when no payloadValidationClass', () => {
        it('should skip validation', async () => {
            const validateSpy = vi.spyOn(classValidator, 'validate');
            const commandSansPayload = {
                type: 'TEST',
                payload: {},
            };

            await CommandValidator.validate(
                commandeHandlerWithoutPayloadValidation,
                commandSansPayload
            );

            expect(validateSpy).not.toHaveBeenCalled();
        });
    });

    describe('when payload is valid', () => {
        it('should call validate and not throw', async () => {
            const commandWithValidPayload = {
                type: 'TEST',
                payload: { name: 'Bob' },
            };
            const validateSpy = vi.spyOn(classValidator, 'validate').mockResolvedValue([]);

            await expect(
                CommandValidator.validate(commandeHandler, commandWithValidPayload)
            ).resolves.not.toThrow();
            expect(validateSpy).toHaveBeenCalled();
        });
    });

    describe('when payload is invalid', () => {
        it('should throw WsValidationError', async () => {
            const commandWithInvalidPayload = {
                type: 'TEST',
                payload: { name: 123 },
            };

            await expect(
                CommandValidator.validate(commandeHandler, commandWithInvalidPayload)
            ).rejects.toBeInstanceOf(WsValidationError);
        });
    });
});
