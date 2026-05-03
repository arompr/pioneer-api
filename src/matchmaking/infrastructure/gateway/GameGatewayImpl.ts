import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { GameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { firstValueFrom } from 'rxjs';
import type { AxiosResponse } from 'axios';

/**
 * HTTP-based implementation of GameGateway.
 * Calls game slice REST endpoints for configuration operations.
 * Enables clean separation and prepares for future microservices evolution.
 */
@Injectable()
export class GameGatewayImpl implements GameGateway {
    private readonly gameServiceBaseUrl = process.env.GAME_SERVICE_URL || 'http://localhost:3000';

    constructor(private readonly httpService: HttpService) {}

    public async createDefaultConfig(gameModeString: string): Promise<{ configId: string }> {
        const url = `${this.gameServiceBaseUrl}/api/gameconfig/default`;
        const response = await firstValueFrom(
            this.httpService.post<{ configId: string }>(url, { gameMode: gameModeString })
        );
        return (response as AxiosResponse<{ configId: string }>).data;
    }

    public async validatePlayerCount(configId: string, currentPlayers: number): Promise<boolean> {
        const url = `${this.gameServiceBaseUrl}/api/gameconfig/${configId}/validate-player-count`;
        const response = await firstValueFrom(
            this.httpService.post<{ valid: boolean }>(url, { playerCount: currentPlayers })
        );
        return (response as AxiosResponse<{ valid: boolean }>).data.valid;
    }
}
