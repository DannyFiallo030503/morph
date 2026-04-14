/**
 * Basic 2D vector class.
 */
export class Vector2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    add(v)       { return new Vector2(this.x + v.x, this.y + v.y); }
    sub(v)       { return new Vector2(this.x - v.x, this.y - v.y); }
    mul(scalar)  { return new Vector2(this.x * scalar, this.y * scalar); }
    length()     { return Math.hypot(this.x, this.y); }
    normalized() {
        const l = this.length();
        return l === 0 ? new Vector2() : new Vector2(this.x / l, this.y / l);
    }
    clone()      { return new Vector2(this.x, this.y); }
}

/**
 * Axis-Aligned Bounding Box for collision detection.
 */
export class Rect {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x; this.y = y; this.w = w; this.h = h;
    }

    /**
     * Check intersection with another rectangle.
     * @param {Rect} other
     * @returns {boolean}
     */
    intersects(other) {
        return this.x < other.x + other.w &&
               this.x + this.w > other.x &&
               this.y < other.y + other.h &&
               this.y + this.h > other.y;
    }

    /**
     * Check if a point is inside the rectangle.
     * @param {number} px
     * @param {number} py
     * @returns {boolean}
     */
    containsPoint(px, py) {
        return px >= this.x && px <= this.x + this.w &&
               py >= this.y && py <= this.y + this.h;
    }
}