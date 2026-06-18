import { clamp, randomRange } from "./Utils";

export default class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    mult(value: number): Vector2 {
        return new Vector2(this.x * value, this.y * value);
    }

    div(value: number): Vector2 {
        return this.mult(1 / value);
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalized(): Vector2 {
        return this.div(this.magnitude());
    }

    distanceTo(other: Vector2): number {
        return other.sub(this).magnitude();
    }

    directionTo(other: Vector2): Vector2 {
        return other.sub(this).normalized();
    }

    rotatedBy(angle: number): Vector2 {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return new Vector2(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
    }

    clamped(xMin: number, xMax: number, yMin: number, yMax: number) {
        return new Vector2(clamp(this.x, xMin, xMax), clamp(this.y, yMin, yMax));
    }

    static randomDirection(): Vector2 {
        const angle = randomRange(0, 2 * Math.PI);
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static random(xMin: number, xMax: number, yMin: number, yMax: number) {
        return new Vector2(randomRange(xMin, xMax), randomRange(yMin, yMax));
    }
}