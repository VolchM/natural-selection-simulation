import SimulationObject from "./SimulationObject.tsx";
import Plant from "./Plant.tsx";
import Animal from "./Animal.tsx";
import Vector2 from "./Vector2.tsx";
import AnimalSpecie from "./AnimalSpecie.tsx";
import { randomRange } from "../Utils.tsx";

export default class SimulationField {
    private _width: number;
    private _height: number;
    private _plants: Map<number, Plant>;
    private _animals: Map<number, Animal>;
    private _lastId: number = 0;
    private _plantSpawnRate: number;
    private _plantSpawnCooldown: number = 0.0;
    private _species: AnimalSpecie[];

    constructor(width: number, height: number, species: AnimalSpecie[], plantSpawnRate: number) {
        this._width = width;
        this._height = height;
        this._species = species;
        this._plantSpawnRate = plantSpawnRate;
        this._plants = new Map<number, Plant>();
        this._animals = new Map<number, Animal>();
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get plants() { return this._plants; }
    get animals() { return this._animals; }
    get species() { return this._species; }

    getNextId(): number {
        this._lastId += 1;
        return this._lastId;
    }

    getObjectById(id: number): SimulationObject | undefined {
        return this._plants.get(id) ?? this._animals.get(id);
    }

    getAllObjects(): SimulationObject[] {
        return [...this._plants.values(), ...this._animals.values()];
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
            this.addPlant(new Plant(this, Vector2.random(0, this._width, 0, this._height), 50));
            this._plantSpawnCooldown = 1 / (this._plantSpawnRate * randomRange(0.5, 1.5));
        }
    }

    renderObjects(): React.JSX.Element[] {
        return [...this._plants.values(), ...this._animals.values()].map(obj => obj.render());
    }
}