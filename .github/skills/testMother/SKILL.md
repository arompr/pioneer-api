---
name: testMother
description: Guide for creating Object Mother + Builder test data factories. Use this when asked to create a test mother, add an object mother, or create test data factories for domain entities.
---

## Skill: Create Test Mother (with Builder)

When asked to "create a test mother", "add an object mother", or similar, follow the Object Mother + Builder pattern to generate flexible test data factories.

### Pattern Overview

The project uses a **two-tier test data creation pattern**:

1. **Test Builder** - Fluent API for flexible object construction with sensible defaults
2. **Test Mother** - Named factory methods for common scenarios, delegating to builders

**Why this pattern?**
- Builders provide flexibility when you need custom configurations
- Mothers provide named, semantic methods for common test scenarios
- Mothers encapsulate builder complexity for typical use cases
- Clear separation: Builders = "how", Mothers = "what"

### Steps to Execute

1. **Identify the target entity**
   - Determine which domain entity needs test support
   - Locate entity in source code (typically `src/[module]/domain/`)

2. **Analyze entity structure**
   - Review constructor parameters
   - Identify value objects and dependencies
   - Note different states or configurations the entity can have

3. **Create Test Builder first**
   - File: `/test/[module]/domain/[entity]/Test[Entity]Builder.ts`
   - Named export: `export class [Entity]Builder`
   - Fluent interface with `with*()` methods
   - Sensible defaults for all required fields

4. **Create Test Mother second**
   - File: `/test/[module]/domain/[entity]/[Entity]Mother.ts`
   - Named export: `export class [Entity]Mother`
   - Named factory methods for scenarios
   - Delegate to builder for object creation

### Test Builder Pattern

**Structure:**
```typescript
export class [Entity]Builder {
    private _field1: Type1 = defaultValue1;
    private _field2: Type2 = defaultValue2;

    /**
     * Override field1 of the entity.
     * @param field1 - The value to set
     */
    public withField1(field1: Type1): [Entity]Builder {
        this._field1 = field1;
        return this;
    }

    /**
     * Override field2 of the entity.
     * @param field2 - The value to set
     */
    public withField2(field2: Type2): [Entity]Builder {
        this._field2 = field2;
        return this;
    }

    /**
     * Builds a new [Entity] instance with the configured properties.
     */
    public build(): [Entity] {
        return new [Entity](this._field1, this._field2);
    }
}
```

**Rules:**
- Private fields prefixed with `_` for internal state
- Each field has a sensible default value
- Each `with*()` method:
  - Takes a parameter matching the field type
  - Sets the private field
  - Returns `this` for fluent chaining
  - Includes JSDoc comment
- Final `build()` method constructs and returns the entity
- No business logic—just construction

### Test Mother Pattern

**Structure:**
```typescript
import { [Entity] } from '#[module]/domain/[entity]/[Entity]';
import { [Entity]Builder } from './Test[Entity]Builder';

/** Test mother for [Entity] domain objects. */
export class [Entity]Mother {
    /** Returns [description of common scenario 1]. */
    public static scenario1[Entity](): [Entity] {
        return new [Entity]Builder()
            .withField1(value1)
            .withField2(value2)
            .build();
    }

    /** Returns [description of common scenario 2]. */
    public static scenario2[Entity](): [Entity] {
        return new [Entity]Builder()
            .withField1(altValue1)
            .build();
    }

    /** Returns a [entity] with custom parameters. */
    public static a[Entity](param1: Type1, param2?: Type2): [Entity] {
        const builder = new [Entity]Builder()
            .withField1(param1);
        
        if (param2 !== undefined) {
            builder.withField2(param2);
        }
        
        return builder.build();
    }
}
```

**Rules:**
- Static methods only
- Method names should be semantic and descriptive
  - Good: `originTile()`, `eastOfOriginTile()`, `aTile(q, r)`
  - Bad: `tile1()`, `getTile()`, `makeTile()`
- Include JSDoc comments explaining what the method returns
- Delegate all construction to builders
- Methods can accept parameters for common variations
- Generic factory method often named `a[Entity]()` or `any[Entity]()`

### Real Example: TileMother + TileBuilder

**Entity:**
```typescript
export class Tile {
    constructor(
        private readonly _coordinates: HexCoordinate,
        private readonly _resourceType: ResourceType
    ) {}
}
```

**TileBuilder:**
```typescript
import { HexCoordinate } from '#game/domain/coordinate/HexCoordinate';
import { ResourceType } from '#game/domain/tile/ResourceType';
import { Tile } from '#game/domain/tile/Tile';

export class TileBuilder {
    private _coordinates: HexCoordinate = HexCoordinate.of(0, 0);
    private _resourceType: ResourceType = ResourceType.WOOD;

    /**
     * Override the coordinates of the Tile.
     * @param coordinates - The coordinates to set
     */
    public withCoordinates(coordinates: HexCoordinate): TileBuilder {
        this._coordinates = coordinates;
        return this;
    }

    /**
     * Override the resource type of the Tile.
     * @param resourceType - The resource type to set
     */
    public withResourceType(resourceType: ResourceType): TileBuilder {
        this._resourceType = resourceType;
        return this;
    }

    /**
     * Builds a new Tile instance with the configured properties.
     */
    public build(): Tile {
        return new Tile(this._coordinates, this._resourceType);
    }
}
```

**TileMother:**
```typescript
import { HexCoordinate } from '#game/domain/coordinate/HexCoordinate';
import { ResourceType } from '#game/domain/tile/ResourceType';
import { Tile } from '#game/domain/tile/Tile';
import { TileBuilder } from './TestTileBuilder';

/** Test mother for Tile domain objects. */
export class TileMother {
    /** Returns a tile at the origin (0,0,0) with a default resource type. */
    public static originTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(0, 0))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile East of the origin (1,0,-1) with a default resource type. */
    public static eastOfOriginTile(): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(1, 0))
            .withResourceType(ResourceType.WOOD)
            .build();
    }

    /** Returns a tile. */
    public static aTile(q: number, r: number): Tile {
        return new TileBuilder()
            .withCoordinates(HexCoordinate.of(q, r))
            .withResourceType(ResourceType.WOOD)
            .build();
    }
}
```

**Usage in tests:**
```typescript
// Using mother for common scenarios
const origin = TileMother.originTile();
const east = TileMother.eastOfOriginTile();

// Using mother with parameters
const custom = TileMother.aTile(2, 3);

// Using builder directly for complex customization
const special = new TileBuilder()
    .withCoordinates(HexCoordinate.of(5, -3))
    .withResourceType(ResourceType.STONE)
    .build();
```

### Import Aliases

Always use project import aliases:
- `#common/*` - common domain objects
- `#matchmaking/*` - matchmaking module
- `#game/*` - game module  
- `#test/*` - test utilities (when importing cross-module test helpers)

### Output Format

After creating the Builder and Mother:

```
✅ Created TileBuilder at test/game/domain/tile/TestTileBuilder.ts

Builder methods:
  - withCoordinates(coordinates: HexCoordinate)
  - withResourceType(resourceType: ResourceType)
  - build() → Tile

✅ Created TileMother at test/game/domain/tile/TileMother.ts

Mother factory methods:
  - originTile() → tile at origin
  - eastOfOriginTile() → tile east of origin
  - northEastOfOriginTile() → tile northeast of origin
  - aTile(q, r) → custom positioned tile

Usage:
  const tile = TileMother.originTile();
  const custom = TileMother.aTile(5, 3);
  const special = new TileBuilder()
      .withCoordinates(HexCoordinate.of(1, 1))
      .withResourceType(ResourceType.STONE)
      .build();
```

### Notes

- Always create Builder first, then Mother
- Builder provides the flexibility; Mother provides the convenience
- Builders should have no business logic—only object construction
- Mothers encode common test scenarios in semantic method names
- Keep defaults simple and valid (satisfy entity invariants)
- For entities with many fields, prioritize the most commonly varied ones for `with*()` methods
- Look at existing Mothers/Builders for naming and style consistency
- Test utilities don't need tests themselves—keep them simple
