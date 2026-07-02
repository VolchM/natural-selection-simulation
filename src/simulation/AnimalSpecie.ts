import { clamp, randomNormalDist } from "../Utils.ts";
import RandomizedStat from "./RandomizedStat.ts";

export enum Sex {
    Male, Female
}

export type AnimalStatName = "maxSpeed" | "visionRadius" | "maxStamina" | "maxSatiety" | "oldAge" | "satietyValue";
export type AnimalInheritedStats = Readonly<Record<AnimalStatName, RandomizedStat>>;
export type AnimalStats = Readonly<Record<AnimalStatName, number>>;

export type AnimalSpecieArgs = { 
    name: string,
    eats: string[],
    startingCount: number,
    inheritedStats: AnimalInheritedStats,
    satietyLoss: number,
    reproductionCooldown: number,
    reproductionCost: number,
    mutationChance: number,
    randomDeviation: number,
    radius: number,
    color: string
}

export default class AnimalSpecie {
    readonly name: string;
    readonly eats: string[];
    readonly startingCount: number;

    readonly inheritedStats: AnimalInheritedStats;
    readonly satietyLoss: number;
    readonly reproductionCooldown: number;
    readonly reproductionCost: number;
    readonly mutationChance: number;
    readonly randomDeviation: number;

    readonly radius: number;
    readonly color: string;

    constructor(args: AnimalSpecieArgs) {
        this.name = args.name;
        this.eats = args.eats;
        this.startingCount = args.startingCount;
        this.inheritedStats = args.inheritedStats;
        this.satietyLoss = args.satietyLoss;
        this.reproductionCooldown = args.reproductionCooldown;
        this.reproductionCost = args.reproductionCost;
        this.mutationChance = args.mutationChance;
        this.randomDeviation = args.randomDeviation;
        this.radius = args.radius;
        this.color = args.color;
    }

    isEating(otherName: string): boolean {
        return this.eats.includes(otherName);
    }

    isCarnivore(): boolean {
        return this.eats.filter(x => x !== "Растение").length > 0;
    }

    randomStats(): AnimalStats {
        return Object.fromEntries(
            Object.entries(this.inheritedStats).map(([key, value]) => [key, value.random()])
        ) as AnimalStats;
    }

    mixAnimalStats(stats1: AnimalStats, stats2: AnimalStats): AnimalStats {
        return Object.fromEntries(
            Object.entries(this.inheritedStats).map(([key, value]) => {
                if (Math.random() < this.mutationChance) {
                    return [key, value.random()];
                } else {
                    let stat = Math.random() < 0.5 ? stats1[key as AnimalStatName] : stats2[key as AnimalStatName];
                    stat = clamp(stat * randomNormalDist(1.0, this.randomDeviation), value.min, value.max);
                    return [key, stat];
                }
            })
        ) as AnimalStats;
    }
}
