import { InMemoryPlayer } from '../player/InMemoryPlayer';
import { InMemoryLobbyConfig } from './lobbyConfig/InMemoryLobbyConfig';

export class InMemoryLobby {
    constructor(
        public id: string,
        public config: InMemoryLobbyConfig,
        public hostId: string,
        public players: InMemoryPlayer[],
        public state: string
    ) {}
}
