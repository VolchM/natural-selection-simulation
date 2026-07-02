export function randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

export function randomNormalDist(mean: number, stdev: number, limit: number | null = null): number {
    const u1 = 1 - Math.random();
    const u2 = Math.random();
    let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    if (limit !== null) {
        if (z0 > limit) z0 = limit;
        else if (z0 < -limit) z0 = -limit;
    }
    return z0 * stdev + mean;
}
