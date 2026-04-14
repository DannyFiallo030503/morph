/**
 * CanvasManager - Wrapper for HTML canvas and 2D context.
 */
export class CanvasManager {
    /**
     * @param {string} canvasId - ID of existing canvas or to be created.
     * @param {number} [width=800]
     * @param {number} [height=600]
     */
    constructor(canvasId, width = 800, height = 600) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = canvasId;
            document.body.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.resize(width, height);
    }

    /**
     * Resize the canvas.
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    /**
     * Clear the canvas with a solid color.
     * @param {string} color - CSS color string.
     */
    clear(color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Get the 2D rendering context.
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
        return this.ctx;
    }
}