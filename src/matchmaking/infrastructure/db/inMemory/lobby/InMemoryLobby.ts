import { InMemoryPlayer } from '../player/InMemoryPlayer';

export class InMemoryLobby {
    constructor(
        public id: string,
        public hostId: string,
        public players: InMemoryPlayer[],
        public state: string,
        public gameConfigId: string
    ) {}
}
