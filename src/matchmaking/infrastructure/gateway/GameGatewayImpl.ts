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
        const url = `${this.gameServiceBaseUrl}/gameconfigs/default`;
        const response = await firstValueFrom(
            this.httpService.post<{ id: string }>(url, { gameMode: gameModeString })
        );
        return { configId: (response as AxiosResponse<{ id: string }>).data.id };
    }

    public async validatePlayerCount(configId: string, currentPlayers: number): Promise<boolean> {
        const url = `${this.gameServiceBaseUrl}/gameconfigs/${configId}`;
        const response = await firstValueFrom(
            this.httpService.get<{ minPlayers: number; maxPlayers: number }>(url)
        );
        const { minPlayers, maxPlayers } = (
            response as AxiosResponse<{ minPlayers: number; maxPlayers: number }>
        ).data;

        if (currentPlayers < minPlayers) {
            throw new Error(`Player count ${currentPlayers} is below minimum ${minPlayers}`);
        }
        if (currentPlayers > maxPlayers) {
            throw new Error(`Player count ${currentPlayers} exceeds maximum ${maxPlayers}`);
        }
        return true;
    }
}
