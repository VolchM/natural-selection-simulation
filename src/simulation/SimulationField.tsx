import SimulationObject from "./SimulationObject.tsx";
import Plant from "./Plant.tsx";
import Animal from "./Animal.tsx";
import Vector2 from "./Vector2.tsx";
import AnimalSpecie from "./AnimalSpecie.tsx";
import type PlantParams from "./PlantParams.tsx";
import { randomRange } from "../Utils.tsx";

export default class SimulationField {
    readonly width: number;
    readonly height: number;
    readonly plantParams: PlantParams;
    readonly species: AnimalSpecie[];
    private _plants: Map<number, Plant>;
    private _animals: Map<number, Animal>;
    private _lastId: number = 0;
    private _simulationTime: number = 0;
    private _plantSpawnCooldown: number = 0;

    constructor(width: number, height: number, plantParams: PlantParams, species: AnimalSpecie[]) {
        this.width = width;
        this.height = height;
        this.plantParams = plantParams;
        this.species = species;
        this._plants = new Map<number, Plant>();
        this._animals = new Map<number, Animal>();

        for (let i = 0; i < this.plantParams.startingCount; i++) {
            const stats = this.plantParams.randomStats();
            this.addPlant(new Plant(this, this.randomPos(), this.plantParams, stats, randomRange(0, 0.75 * stats.oldAge)));
        }
        for (const specie of this.species) {
            for (let i = 0; i < specie.startingCount; i++) {
                const stats = specie.randomStats();
                this.addAnimal(new Animal(this, this.randomPos(), specie, stats, randomRange(0, 0.75 * stats.oldAge)));
            }
        }
    }

    get plants() { return this._plants; }
    get animals() { return this._animals; }
    get simulationTime() { return this._simulationTime; }

    getNextId(): number {
        this._lastId += 1;
        return this._lastId;
    }

    randomPos(): Vector2 {
        return Vector2.random(0, this.width, 0, this.height);
    }

    getObjectById(id: number): SimulationObject | undefined {
        return this._plants.get(id) ?? this._animals.get(id);
    }
    
    addPlant(obj: Plant) {
        this._plants.set(obj.id, obj);
    }

    addAnimal(obj: Animal) {
        this._animals.set(obj.id, obj);
    }

    removeObjectById(id: number) {
        this._plants.delete(id);
        this._animals.delete(id);
    }

    update(deltaTime: number) {
        const plantIds = [...this._plants.keys()];
        for (const id of plantIds) {
            this._plants.get(id)?.update(deltaTime);
        }
        const animalIds = [...this._animals.keys()];
        for (const id of animalIds) {
            this._animals.get(id)?.update(deltaTime);
        }

        this._plantSpawnCooldown -= deltaTime;
        if (this._plantSpawnCooldown <= 0) {
            for (let i = 0; i < this.plantParams.spawnRate; i++) {
                this.addPlant(new Plant(this, Vector2.random(0, this.width, 0, this.height), this.plantParams, this.plantParams.randomStats()));
            }
            this._plantSpawnCooldown = randomRange(0.75, 1.25);
        }
        this._simulationTime += deltaTime;
    }
}