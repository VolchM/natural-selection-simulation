import type RandomizedStat from "./RandomizedStat";

export type PlantStats = {
    readonly satietyValue: number,
    readonly oldAge: number,
}

export type PlantParamsArgs = {
    startingCount: number,
    spawnRate: number,
    satietyValue: RandomizedStat,
    oldAge: RandomizedStat,
    radius: number,
    color: string
}

export default class PlantParams {
    readonly startingCount: number;
    readonly spawnRate: number;
    
    readonly satietyValue: RandomizedStat;
    readonly oldAge: RandomizedStat;

    readonly radius: number;
    readonly color: string;

    constructor(args: PlantParamsArgs) {
        this.startingCount = args.startingCount;
        this.spawnRate = args.spawnRate;
        this.satietyValue = args.satietyValue;
        this.oldAge = args.oldAge;
        this.radius = args.radius;
        this.color = args.color;
    }

    randomStats(): PlantStats {
        return {
            satietyValue: this.satietyValue.random(),
            oldAge: this.oldAge.random(),
        }
    }
}