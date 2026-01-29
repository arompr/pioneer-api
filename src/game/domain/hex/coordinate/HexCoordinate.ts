import { Direction } from '../Direction.ts';
import { Distance } from '../Distance.ts';

type AxialOffset = readonly [dq: number, dr: number];

/**
 * Represents a point on a hexagonal grid using axial coordinates (q, r). Cube coordinates (q, r, s)
 * are derived from axial coordinates where s = -q - r.
 *
 * Two Coordinates with the same q and r are considered equal.
 *
 * Responsibilities:
 *
 * - Hex geometry (neighbors, distance)
 * - Direction math
 */
export class HexCoordinate {
    private static readonly DIRECTIONS: readonly Direction[] = [
        Direction.EAST,
        Direction.NORTHEAST,
        Direction.NORTHWEST,
        Direction.WEST,
        Direction.SOUTHWEST,
        Direction.SOUTHEAST,
    ];

    private static readonly DIRECTION_OFFSETS: Record<Direction, AxialOffset> = {
        [Direction.EAST]: [1, 0],
        [Direction.NORTHEAST]: [1, -1],
        [Direction.NORTHWEST]: [0, -1],
        [Direction.WEST]: [-1, 0],
        [Direction.SOUTHWEST]: [-1, 1],
        [Direction.SOUTHEAST]: [0, 1],
    };

    public readonly q: number;
    public readonly r: number;

    /**
     * Creates a new {@link HexCoordinate}.
     *
     * This constructor is private. Use {@link HexCoordinate.of} to create instances.
     *
     * @param q - The axial q coordinate.
     * @param r - The axial r coordinate.
     */
    private constructor(q: number, r: number) {
        this.q = q;
        this.r = r;
    }

    /**
     * Creates a {@link HexCoordinate} from q and r Axial coordinates.
     *
     * @param q Axial q coordinate
     * @param r Axial r coordinate
     * @returns A new {@link HexCoordinate} instance.
     */
    public static of(q: number, r: number): HexCoordinate {
        return new HexCoordinate(q, r);
    }
    /**
     * Computes the distance to another coordinate using cube distance.
     * @param other Other {@link HexCoordinate}
     * @returns Distance (number of hexes)
     */
    public distanceTo(other: HexCoordinate): Distance {
        return Distance.fromHexes(this.calculateDistance(other.q, other.r, other.s));
    }

    private calculateDistance(q: number, r: number, s: number): number {
        return (Math.abs(this.q - q) + Math.abs(this.r - r) + Math.abs(this.s - s)) / 2;
    }

    /**
     * Returns all six neighboring coordinates in axial directions.
     * @returns Array of neighboring {@link HexCoordinate}
     */
    public neighbors(): HexCoordinate[] {
        return HexCoordinate.DIRECTIONS.map((direction) => this.neighbor(direction));
    }

    /**
     * Returns the neighbor in a specific direction.
     * @param direction - The {@link Direction} of the neighbor.
     * @returns Neighboring {@link HexCoordinate}
     */
    public neighbor(direction: Direction): HexCoordinate {
        const offset = HexCoordinate.DIRECTION_OFFSETS[direction];
        return HexCoordinate.of(this.q + offset[0], this.r + offset[1]);
    }

    /**
     * Cube coordinate s = -q - r
     */
    get s(): number {
        return -this.q - this.r;
    }

    /**
     * Checks value equality with another coordinate.
     * @param other - The coordinate to compare against.
     * @returns {@code true} if coordinates represent the same point.
     */
    public equals(other: HexCoordinate): boolean {
        return this.q === other.q && this.r === other.r;
    }

    /**
     * Returns a string representation of the coordinate.
     * @returns `Coordinate(q, r, s)` string
     */
    public toString(): string {
        return `Coordinate(q=${this.q}, r=${this.r}, s=${this.s})`;
    }
}
