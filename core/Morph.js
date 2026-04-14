import { EngineLoop } from './EngineLoop.js';
import { EntityManager } from './EntityManager.js';
import { EventBus } from './EventBus.js';
import { InputManager } from './InputManager.js';
import { CanvasManager } from './CanvasManager.js';
import { AssetLoader } from './AssetLoader.js';

/**
 * Morph - Main engine class that ties together all core systems.
 */
export class Morph {
    /**
     * @param {Object} config - Configuration options.
     * @param {string} [config.canvasId='game-canvas'] - ID of canvas element.
     * @param {number} [config.width=800] - Canvas width.
     * @param {number} [config.height=600] - Canvas height.
     * @param {string} [config.backgroundColor='#f0f0f0'] - Clear color.
     */
    constructor(config = {}) {
        this.config = {
            canvasId: config.canvasId || 'game-canvas',
            width: config.width || 800,
            height: config.height || 600,
            backgroundColor: config.backgroundColor || '#f0f0f0'
        };

        this.canvas = new CanvasManager(this.config.canvasId, this.config.width, this.config.height);
        this.events = new EventBus();
        this.entities = new EntityManager();
        this.input = new InputManager(this.canvas.canvas);
        this.assets = new AssetLoader();

        this._updateCallback = (dt) => this._update(dt);
        this._drawCallback = () => this._draw();

        this.loop = new EngineLoop(this._updateCallback, this._drawCallback);
        this._systems = []; // For modular systems

        this.deltaTime = 0;
    }

    /**
     * Add a system (module) with optional update and/or draw methods.
     * @param {Object} system - { update(dt, engine), draw(ctx, engine) }
     */
    addSystem(system) {
        this._systems.push(system);
    }

    _update(dt) {
        this.deltaTime = dt;
        for (const sys of this._systems) {
            if (sys.update) sys.update(dt, this);
        }
        this.events.emit('update', { dt, engine: this });
    }

    _draw() {
        this.canvas.clear(this.config.backgroundColor);
        for (const sys of this._systems) {
            if (sys.draw) sys.draw(this.canvas.getContext(), this);
        }
        this.events.emit('draw', { ctx: this.canvas.getContext(), engine: this });
    }

    /** Start the engine loop. */
    start() {
        this.loop.start();
        this.events.emit('start', this);
    }

    /** Stop the engine loop. */
    stop() {
        this.loop.stop();
        this.events.emit('stop', this);
    }

    /**
     * Enable a simple default renderer that draws all entities with
     * position (x, y) and size (w, h). Useful for quick prototyping.
     */
    enableDefaultRenderer() {
        this.addSystem({
            draw(ctx, engine) {
                const entities = engine.entities.getAll();
                for (const e of entities) {
                    if (e.x !== undefined && e.y !== undefined && e.w !== undefined && e.h !== undefined) {
                        ctx.fillStyle = e.color || '#000';
                        ctx.fillRect(e.x, e.y, e.w, e.h);
                        if (e.text) {
                            ctx.fillStyle = '#fff';
                            ctx.font = '12px monospace';
                            ctx.fillText(e.text, e.x, e.y - 5);
                        }
                    }
                }
            }
        });
    }
}