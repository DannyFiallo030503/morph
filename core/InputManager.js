/**
 * InputManager - Handles keyboard and mouse input state.
 */
export class InputManager {
    /**
     * @param {HTMLElement} target - Element for mouse events (typically canvas).
     *   Keyboard events are always bound to window.
     */
    constructor(target = window) {
        this.keys = new Map();
        this.mouse = { x: 0, y: 0, left: false, right: false };
        this._target = target;
        this._setupListeners(target);
    }

    _setupListeners(target) {
        const GAME_KEYS = new Set([
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'w', 'a', 's', 'd',
            ' ' // spacebar
        ]);

        // Keyboard events (window)
        window.addEventListener('keydown', (e) => {
            this.keys.set(e.key, true);
            if (GAME_KEYS.has(e.key)) e.preventDefault();
        });
        window.addEventListener('keyup', (e) => {
            this.keys.set(e.key, false);
        });

        // Mouse events (target canvas)
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect
                ? target.getBoundingClientRect()
                : { left: 0, top: 0 };
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        target.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.left = true;
            if (e.button === 2) this.mouse.right = true;
        });
        target.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.left = false;
            if (e.button === 2) this.mouse.right = false;
        });
        // Prevent context menu on right-click
        target.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Check if a key is currently pressed.
     * @param {string} key - Key value (e.g., 'ArrowUp', 'w').
     * @returns {boolean}
     */
    isKeyDown(key) {
        return this.keys.get(key) === true;
    }

    /**
     * Get normalized axis from four directional keys.
     * @returns {{x: number, y: number}} Values between -1 and 1.
     */
    getAxis(upKey, downKey, leftKey, rightKey) {
        return {
            x: (this.isKeyDown(rightKey) ? 1 : 0) - (this.isKeyDown(leftKey) ? 1 : 0),
            y: (this.isKeyDown(downKey) ? 1 : 0) - (this.isKeyDown(upKey) ? 1 : 0)
        };
    }

    /** Clear all key states (useful on window blur). */
    clearKeys() {
        this.keys.clear();
    }
}