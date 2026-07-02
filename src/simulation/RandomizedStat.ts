import { randomNormalDist } from "../Utils.ts";

export default class RandomizedStat {
    readonly mean: number;
    readonly maxdev: number;

    constructor(mean: number, maxdev: number) {
        this.mean = mean;
        this.maxdev = maxdev;
    }

    get min() { return this.mean - this.maxdev; }
    get max() { return this.mean + this.maxdev; }

    random(): number {
        return randomNormalDist(this.mean, this.maxdev / 3, 3);
    }
}
