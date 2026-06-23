import { clamp, randomNormalDist } from "../Utils";
import RandomizedStat from "./RandomizedStat";

export enum AnimalDiet {
    Herbivore, Carnivore
}

export enum Sex {
    Male, Female
}

export type AnimalStatName = "maxSpeed" | "visionRadius" | "maxStamina" | "maxSatiety" | "oldAge" | "satietyValue";
export type InheritedStats = Record<AnimalStatName, RandomizedStat>;
export type AnimalStats = Record<AnimalStatName, number>;

export default class AnimalSpecie {
    readonly name: string;
    readonly diet: AnimalDiet;
    readonly eats: string[];

    readonly inheritedStats: InheritedStats;
    readonly mutationChance: number;
    readonly randomDeviation: number;

    readonly radius: number;
    readonly color: string;

    constructor(args: { name: string, diet: AnimalDiet, eats?: string[],
                        inheritedStats: InheritedStats,
                        mutationChance: number, randomDeviation: number,
                        radius: number, color: string }) {
        this.name = args.name;
        this.diet = args.diet;
        this.eats = args.eats ?? [];
        this.inheritedStats = args.inheritedStats;
        this.mutationChance = args.mutationChance;
        this.randomDeviation = args.randomDeviation;
        this.radius = args.radius;
        this.color = args.color;
    }

    isEating(otherName: string): boolean {
        return this.eats.includes(otherName);
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
