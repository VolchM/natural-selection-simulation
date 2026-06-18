export function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}
