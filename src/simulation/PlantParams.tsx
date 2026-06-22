export type PlantParamsArgs = {
    startingCount: number,
    spawnRate: number,
    satietyValue: number,
    oldAge: number,
    radius: number,
    color: string
}

export default class PlantParams {
    startingCount: number;
    spawnRate: number;
    
    satietyValue: number;
    oldAge: number;

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
}