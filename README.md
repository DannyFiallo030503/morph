# 🎮 Morph — Modular web game engine

## 1. Project philosophy

**Creating games for the web should be fast, reusable, and not repetitive.**

When you develop games directly with HTML, CSS, and JS, each new game forces you to rewrite the same foundations: main loop, input handling, rendering, collisions… It’s tedious and error-prone. Existing tools are powerful (Phaser, Babylon, Three.js), but often have steep learning curves or don’t easily adapt to different genres without a lot of boilerplate code.

**Morph** is born to fill that gap. It’s not a monolithic engine, but a **common base** (Core) + **interchangeable modules** + **predefined collections** (presets) that let you create anything from a 2D platformer to an isometric open world, or a soul-like, writing only your game’s unique logic.

### Key principles

- **Ultra‑light Core** → only the loop, entities, events, and input.
- **Independent modules** → each adds a specific capability (physics, tiles, isometric camera, AI, etc.).
- **Module collections (presets)** → combinations that define a genre or game style.
- **Final game** → pick a preset or individual modules, then add your own logic.
- **Natively cross‑platform** → runs in any browser.

## 2. General architecture

+--------------------------------------------------+
| GAME |
| (your unique logic: rules, levels, story) |
+----------------------+---------------------------+
|
v
+--------------------------------------------------+
| PRESETS (Collections) |
| RPG | Platformer | Soul-like | Open World |
+----------------------+---------------------------+
|
v
+--------------------------------------------------+
| MODULES |
| Physics | Tiles | Camera | AI | Particles ... |
+----------------------+---------------------------+
|
v
+--------------------------------------------------+
| CORE |
| Loop | Entities | Events | Input | Canvas |
+--------------------------------------------------+


### 2.1 Core

The Core is the only mandatory part. It provides:

- **Game loop** (`update(deltaTime)`, `draw(ctx)`)
- **Entity manager** (add, remove, query by components)
- **Event system** (internal and external pub/sub)
- **Unified input** (keyboard, mouse, touch) with configurable mapping
- **Adaptive canvas** (resize, scale, handle 2D/WebGL contexts)
- **Basic asset loading** (images, sounds, JSON)

The Core **knows nothing** about genres, advanced physics, or 3D. It only orchestrates time, entities, and events.

### 2.2 Modules

A module is a JS file (or class) that **extends or modifies** the Core. Each module:

- Declares which Core parts it depends on (e.g. `"core.entities"`, `"core.input"`).
- Adds new methods to the Core or to entities (via mixins or composition).
- Can add its own update loop (physics, animations).
- Defines events it emits or listens to.

Example modules:

| Module          | Function                                                                 |
|-----------------|--------------------------------------------------------------------------|
| `tile-engine`   | Load and render tile maps (JSON / CSV).                                  |
| `physics-2d`    | AABB collisions, gravity, ground detection.                              |
| `camera-2d`     | Follow an entity, zoom, boundaries.                                      |
| `isometric`     | Convert Cartesian to isometric coordinates, render 45° tiles.            |
| `procedural`    | World generation with Perlin/Simplex noise, biomes, height.              |
| `soul-combat`   | Combat system with i‑frames, stamina, parry, bonfire respawn.            |
| `open-world`    | Chunk streaming, lazy region loading, entity LOD.                        |
| `particles`     | Configurable particle systems.                                           |

A module can **depend on another module** (e.g. `isometric` needs `tile-engine`).

### 2.3 Presets (module collections)

A preset is a set of preconfigured modules for a genre or style. When you apply a preset, Morph:

- Loads the required modules.
- Applies default settings (gravity, tile size, camera type…).
- Exposes high‑level functions (`createPlayer()`, `generateWorld()`).

Example presets:

| Preset           | Included modules                                         | Typical configuration                         |
|------------------|----------------------------------------------------------|-----------------------------------------------|
| **Platformer**   | `physics-2d`, `tile-engine`, `camera-2d`, `particles`    | Gravity -9.8, 16x16 tiles, side camera        |
| **Turn‑based RPG**| `tile-engine`, `ui-menus`, `turn-queue`, `save-system`  | 32x32 grid, turn combat, local save           |
| **Soul‑like**    | `soul-combat`, `checkpoints`, `isometric` (or 2D), `enemy-ai` | Stamina, i‑frames, respawn, aggressive AI |
| **Open world**   | `procedural`, `open-world`, `inventory`, `day-night`    | 64x64 chunks, biomes, day/night cycle        |

You can **modify any preset** (change gravity, disable modules, add others). Presets are just shortcuts.

## 3. Workflow to create a game with Morph

1. **Pick a preset** (or start with only the Core).
2. **Configure the modules** (adjust parameters, asset paths).
3. **Write your specific logic** using the functions exposed by modules.
4. **Test with the example mini‑game** included in the repository.

Conceptual example (not actual code):

```javascript
// Initialize Morph with the "platformer" preset
const game = new Morph({
  preset: 'platformer',
  settings: {
    gravity: -12,
    tileSize: 16,
    startLevel: 'level1.json'
  }
});

// Add a controllable character
game.createPlayer({
  sprite: 'hero.png',
  speed: 200,
  jumpForce: 400
});

// Add custom logic
game.on('collision', (a, b) => {
  if (a.type === 'coin') game.score += 10;
});

## 4. Extensibility and customization
### 4.1 Create your own Morph module

// myModule.js
export default {
  name: 'my-module',
  dependencies: ['core.entities', 'core.input'],
  install(engine, options) {
    // Add a method to the core
    engine.myFunction = () => {...};

    // Listen to a core event
    engine.on('update', (dt) => {...});
  }
};

Then load it: game.use(myModule, { options: ... }).

### 4.2 Modify an existing preset

game.loadPreset('soul-like', {
  override: {
    gravity: 0,           // no gravity (top‑down view)
    staminaEnabled: false
  },
  addModules: ['my-custom-module'],
  removeModules: ['day-night']
});

### 4.3 Using the Core as a standalone library
You can use Morph’s Core without any modules and build everything manually. Modules are only optional convenience layers.

## 5. The example mini‑game
To validate that Morph works, the repository will include a complete mini‑game that demonstrates:

Core usage (loop, events, input)

At least 3 different modules (e.g. tile-engine, physics-2d, particles)

One preset (e.g. "platformer" or "collectathon")

Simple procedural generation (noise for a tile map)

The mini‑game will be playable directly by opening index.html. It will serve as a living reference and proof that the architecture is solid.

## 6. Development roadmap (phases)
Phase 0 – Stable Core
Game loop, responsive canvas, basic entities, events, input (keyboard + mouse).

Simple image and sound loading.

A "bouncing ball" example with no modules.

Phase 1 – Foundational modules
tile-engine (load and render 2D tile maps)

physics-2d (AABB collisions, gravity)

camera-2d (follow, zoom)

Phase 2 – First preset (Platformer)
Combine the three modules above.

Simple platformer mini‑game (collect coins, jump on enemies).

Phase 3 – Advanced modules
procedural (noise, infinite maps)

isometric (2D → isometric transformation)

soul-combat (combat system)

Phase 4 – Genre presets
Turn‑based RPG

Soul‑like

Open world

Phase 5 – Optimizations and documentation
Interactive examples, module creation guide, project generator.

## 7. Frequently asked questions (conceptual)
Can I make real 3D (WebGL) games with Morph?
Yes, via a renderer-3d module that implements the same interface as the 2D renderer. The Core doesn’t distinguish between 2D and 3D – only entities with position and components.

How does performance scale with many modules?
Only the code of loaded modules runs. Additionally, each module can enable/disable its logic at runtime (e.g. disable physics in menus).

Can I use Morph without strong programming skills?
Morph is not a no‑code tool; it targets web developers who want to speed up their workflow. However, presets drastically reduce the amount of code needed.

Can I export to mobile (Cordova, Capacitor)?
Yes, because it’s pure HTML/JS, it runs inside a WebView without changes. The Core already handles touch events.

## 8. Conclusion
Morph does not aim to compete with AAA engines. Instead, it offers an agile and modular base for web creators tired of rewriting the same things. Its superpower is the collection of modules and presets, allowing you to switch genres without discarding previous work.

The repository will be public, under the MIT license, so anyone can use it, modify it, or create their own modules. The example mini‑game will prove that the idea works in practice.

