import { randomNormalDist } from "../Utils";

export default class RandomizedStat {
    readonly mean: number;
    readonly stdev: number;

    constructor(mean: number, stdev: number) {
        this.mean = mean;
        this.stdev = stdev;
    }

    get min() { return this.mean - this.stdev * 3; }
    get max() { return this.mean + this.stdev * 3; }

    random(): number {
        return randomNormalDist(this.mean, this.stdev, 3);
    }
}
