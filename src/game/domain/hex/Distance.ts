export class Distance {
    private readonly hexes: number;

    private constructor(hexes: number) {
        if (hexes < 0) {
            throw new Error(`Distance cannot be negative: ${hexes}`);
        }

        this.hexes = hexes;
    }

    public static fromHexes(hexes: number): Distance {
        return new Distance(hexes);
    }

    public isLessThan(other: Distance): boolean {
        return this.hexes < other.hexes;
    }

    public isGreaterThan(other: Distance): boolean {
        return this.hexes > other.hexes;
    }

    public add(other: Distance): Distance {
        return new Distance(this.hexes + other.hexes);
    }

    public equals(other: Distance): boolean {
        return this.hexes === other.hexes;
    }

    public getHexes(): number {
        return this.hexes;
    }

    public toString(): string {
        return `${this.hexes} hex${this.hexes !== 1 ? 'es' : ''}`;
    }
}
