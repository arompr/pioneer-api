export class InMemoryPlayer {
    constructor(
        public id: string,
        public publicKey: string,
        public tokenPrefix: string,
        public tokenHash: string,
        public name: string,
        public status: string
    ) {}
}
