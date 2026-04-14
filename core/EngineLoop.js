/**
 * EngineLoop - Manages the game loop using requestAnimationFrame.
 * Provides delta time and ensures update/draw callbacks are called.
 */
export class EngineLoop {
    /**
     * @param {Function} updateCallback - Called with delta time (in seconds).
     * @param {Function} drawCallback - Called after update to render.
     */
    constructor(updateCallback, drawCallback) {
        this.updateCallback = updateCallback;
        this.drawCallback = drawCallback;
        this.running = false;
        this.lastTimestamp = 0;
        this.animationId = null;
    }

    /** Start the game loop. */
    start() {
        if (this.running) return;
        this.running = true;
        this.animationId = requestAnimationFrame((t) => {
            this.lastTimestamp = t;
            this._loop(t);
        });
    }

    /** Stop the game loop. */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.running = false;
    }

    /** Internal loop handler. */
    _loop(now) {
        if (!this.running) return;

        // Cap delta to 100ms to avoid huge jumps after tab inactive
        const dt = Math.min(0.1, (now - this.lastTimestamp) / 1000);
        this.lastTimestamp = now;

        this.updateCallback(dt);
        this.drawCallback();

        this.animationId = requestAnimationFrame((t) => this._loop(t));
    }
}