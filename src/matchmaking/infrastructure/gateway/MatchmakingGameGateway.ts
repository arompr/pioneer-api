import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { IGameGateway } from '#matchmaking/domain/gateway/GameGateway';
import { firstValueFrom } from 'rxjs';
import type { AxiosResponse } from 'axios';

/**
 * HTTP-based implementation of IGameGateway.
 * Calls game slice REST endpoints for configuration operations.
 * Enables clean separation and prepares for future microservices evolution.
 */
@Injectable()
export class MatchmakingGameGateway implements IGameGateway {
    private readonly gameServiceBaseUrl = process.env.GAME_SERVICE_URL || 'http://localhost:3000';

    constructor(private readonly httpService: HttpService) {}

    public async createConfig(gameModeString: string): Promise<{ configId: string }> {
        const url = `${this.gameServiceBaseUrl}/gameconfigs`;
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
