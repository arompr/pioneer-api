import { NegativeDistanceError } from './errors/NegativeDistanceError.ts';

/**
 * Represents a distance expressed as a non-negative number of hexes.
 */
export class Distance {
    private readonly hexes: number;

    /**
     * Creates a new {@link Distance}.
     *
     * This constructor is private. Use {@link Distance.fromHexes} to create instances.
     *
     * @param hexes - The number of hexes represented by this distance.
     * @throws {Error} If the provided hex value is negative.
     */
    private constructor(hexes: number) {
        if (hexes < 0) {
            throw new NegativeDistanceError(hexes);
        }

        this.hexes = hexes;
    }

    /**
     * Creates a {@link Distance} from a number of hexes.
     *
     * @param hexes - The number of hexes represented by the distance.
     * @returns A new {@link Distance} instance.
     * @throws {Error} If the provided hex value is negative.
     */
    public static fromHexes(hexes: number): Distance {
        return new Distance(hexes);
    }

    /**
     * Determines whether this distance is smaller than another distance.
     *
     * @param other - The distance to compare against.
     * @returns {@code true} if this distance is less than the other distance.
     */
    public isLessThan(other: Distance): boolean {
        return this.hexes < other.hexes;
    }

    /**
     * Determines whether this distance is greater than another distance.
     *
     * @param other - The distance to compare against.
     * @returns {@code true} if this distance is greater than the other distance.
     */
    public isGreaterThan(other: Distance): boolean {
        return this.hexes > other.hexes;
    }

    /**
     * Returns a new {@link Distance} representing the sum of this distance
     * and another distance.
     *
     * @param other - The distance to add.
     * @returns A new {@link Distance} equal to the sum of both distances.
     */
    public add(other: Distance): Distance {
        return new Distance(this.hexes + other.hexes);
    }

    /**
     * Determines whether this distance is equal to another distance.
     *
     * Two distances are considered equal if they represent the same number
     * of hexes.
     *
     * @param other - The distance to compare against.
     * @returns {@code true} if both distances have the same value.
     */
    public equals(other: Distance): boolean {
        return this.hexes === other.hexes;
    }

    /**
     * Returns the number of hexes represented by this distance.
     *
     * @returns The distance value in hexes.
     */
    public getHexes(): number {
        return this.hexes;
    }

    /**
     * Returns a human-readable string representation of this distance.
     *
     * @returns A string representation of the distance (e.g. "1 hex", "2 hexes").
     */
    public toString(): string {
        return `${this.hexes} hex${this.hexes !== 1 ? 'es' : ''}`;
    }
}
