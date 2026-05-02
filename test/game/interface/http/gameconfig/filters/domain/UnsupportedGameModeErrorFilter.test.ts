import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ArgumentsHost } from '@nestjs/common';
import { UnsupportedGameModeErrorFilter } from '#game/interface/http/gameconfig/filters/domain/UnsupportedGameModeErrorFilter';
import { UnsupportedGameModeError } from '#game/domain/config/errors/UnsupportedGameModeError';

describe('UnsupportedGameModeErrorFilter', () => {
    let filter: UnsupportedGameModeErrorFilter;

    beforeEach(() => {
        filter = new UnsupportedGameModeErrorFilter();
    });

    describe('catch', () => {
        describe('when catching an UnsupportedGameModeError', () => {
            it('returns a 400 status code', () => {
                const exception = new UnsupportedGameModeError('INVALID_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
                };

                const host = {
                    switchToHttp: vi.fn().mockReturnValue({
                        getResponse: vi.fn().mockReturnValue(response),
                        getRequest: vi.fn().mockReturnValue(request),
                    }),
                };

                filter.catch(exception, host as unknown as ArgumentsHost);

                expect(response.status).toHaveBeenCalledWith(400);
            });

            it('returns the correct error code', () => {
                const exception = new UnsupportedGameModeError('INVALID_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
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
                expect(jsonCall.code).toBe('UNSUPPORTED_GAME_MODE');
            });

            it('returns the correct response structure', () => {
                const exception = new UnsupportedGameModeError('INVALID_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
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

            it('includes the unsupported mode in the message', () => {
                const exception = new UnsupportedGameModeError('CUSTOM_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
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
                expect(jsonCall.message).toContain('CUSTOM_MODE');
                expect(jsonCall.message).toContain('not supported');
            });

            it('includes the correct HTTP method', () => {
                const exception = new UnsupportedGameModeError('INVALID_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
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
                expect(jsonCall.method).toBe('POST');
            });

            it('includes the correct URL path', () => {
                const exception = new UnsupportedGameModeError('INVALID_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
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
                expect(jsonCall.path).toBe('/gameconfigs');
            });

            it('includes a valid ISO timestamp', () => {
                const exception = new UnsupportedGameModeError('INVALID_MODE');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/gameconfigs',
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
                expect(filter.statusCode).toBe(400);
            });

            it('has the correct code constant', () => {
                expect(filter.code).toBe('UNSUPPORTED_GAME_MODE');
            });
        });

        describe('with different game modes', () => {
            it('handles various unsupported mode strings', () => {
                const modes = ['ADVANCED', 'COOP', 'TOURNAMENT', ''];

                modes.forEach((mode) => {
                    const exception = new UnsupportedGameModeError(mode);

                    const response = {
                        status: vi.fn().mockReturnThis(),
                        json: vi.fn(),
                    };

                    const request = {
                        method: 'POST',
                        url: '/gameconfigs',
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
                    expect(jsonCall.message).toContain(mode);
                });
            });
        });

        describe('with different request paths', () => {
            it('handles different URL paths', () => {
                const exception = new UnsupportedGameModeError('INVALID');

                const response = {
                    status: vi.fn().mockReturnThis(),
                    json: vi.fn(),
                };

                const request = {
                    method: 'POST',
                    url: '/api/v1/gameconfigs',
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
                expect(jsonCall.path).toBe('/api/v1/gameconfigs');
            });
        });
    });
});
