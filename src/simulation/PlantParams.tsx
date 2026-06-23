import type RandomizedStat from "./RandomizedStat";

export type PlantStats = {
    satietyValue: number,
    oldAge: number,
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
    startingCount: number;
    spawnRate: number;
    
    satietyValue: RandomizedStat;
    oldAge: RandomizedStat;

    radius: number;
    color: string;

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