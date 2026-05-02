import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ArgumentsHost } from '@nestjs/common';
import { GameConfigNotFoundErrorFilter } from '#game/interface/http/gameconfig/filters/domain/GameConfigNotFoundErrorFilter';
import { GameConfigNotFoundError } from '#game/domain/config/errors/GameConfigNotFoundError';
import { GameConfigId } from '#game/domain/config/GameConfigId';

describe('GameConfigNotFoundErrorFilter', () => {
    let filter: GameConfigNotFoundErrorFilter;

    beforeEach(() => {
        filter = new GameConfigNotFoundErrorFilter();
    });

    describe('catch', () => {
        describe('when catching a GameConfigNotFoundError', () => {
            it('returns a 404 status code', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                expect(response.status).toHaveBeenCalledWith(404);
            });

            it('returns the correct error code', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                expect(jsonCall.code).toBe('GAME_CONFIG_NOT_FOUND');
            });

            it('returns the correct response structure', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                expect(jsonCall).toHaveProperty('statusCode');
                expect(jsonCall).toHaveProperty('code');
                expect(jsonCall).toHaveProperty('message');
                expect(jsonCall).toHaveProperty('timestamp');
                expect(jsonCall).toHaveProperty('method');
                expect(jsonCall).toHaveProperty('path');
            });

            it('includes the correct message', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                expect(jsonCall.message).toBe('Game config not found');
            });

            it('includes the correct HTTP method', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                expect(jsonCall.method).toBe('GET');
            });

            it('includes the correct URL path', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                expect(jsonCall.path).toBe('/gameconfigs/test-id');
            });

            it('includes a valid ISO timestamp', () => {
                const gameConfigId = new GameConfigId('test-id');
                const exception = new GameConfigNotFoundError(gameConfigId);

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/gameconfigs/test-id',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                const timestamp = new Date(jsonCall.timestamp as string);
                expect(timestamp).toBeInstanceOf(Date);
                expect(timestamp.getTime()).toBeGreaterThan(0);
            });

            it('has the correct status code constant', () => {
                expect(filter.statusCode).toBe(404);
            });

            it('has the correct code constant', () => {
                expect(filter.code).toBe('GAME_CONFIG_NOT_FOUND');
            });
        });

        describe('with different request paths', () => {
            it('handles different URL paths', () => {
                const exception = new GameConfigNotFoundError(new GameConfigId('id-1'));

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'GET',
                    url: '/api/gameconfigs/123',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                const jsonCall = (response.json as unknown as ReturnType<typeof vi.fn>).mock
                    .calls[0][0] as Record<string, unknown>;
                expect(jsonCall.path).toBe('/api/gameconfigs/123');
            });
        });
    });
});
