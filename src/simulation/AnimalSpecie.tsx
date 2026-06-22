export enum AnimalDiet {
    Herbivore, Carnivore
}

export enum Sex {
    Male, Female
}

export default class AnimalSpecie {
    name: string;
    diet: AnimalDiet;
    eats: string[];

    maxSpeed: number;
    visionRadius: number;
    maxStamina: number;
    maxSatiety: number;
    oldAge: number;
    satietyValue: number;

    radius: number;
    color: string;

    constructor(args: { name: string, diet: AnimalDiet, eats?: string[],
                        maxSpeed: number, visionRadius: number,
                        maxStamina: number, maxSatiety: number,
                        oldAge: number, satietyValue: number,
                        radius: number, color: string }) {
        this.name = args.name;
        this.diet = args.diet;
        this.eats = args.eats ?? [];
        this.maxSpeed = args.maxSpeed;
        this.visionRadius = args.visionRadius;
        this.maxStamina = args.maxStamina;
        this.maxSatiety = args.maxSatiety;
        this.oldAge = args.oldAge;
        this.satietyValue = args.satietyValue;
        this.radius = args.radius;
        this.color = args.color;
    }

    isEating(otherName: string): boolean {
        return this.eats.includes(otherName);
    }
}
