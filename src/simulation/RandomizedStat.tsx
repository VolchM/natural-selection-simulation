import { randomNormalDist } from "../Utils";

export default class RandomizedStat {
    readonly mean: number;
    readonly stdev: number;
    readonly limit: number;

    constructor(mean: number, stdev: number, limit: number = 3) {
        this.mean = mean;
        this.stdev = stdev;
        this.limit = limit;
    }

    get min() { return this.mean - this.stdev * this.limit; }
    get max() { return this.mean + this.stdev * this.limit; }

    random(): number {
        return randomNormalDist(this.mean, this.stdev, this.limit);
    }
}
