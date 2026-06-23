import SimulationObject from "./SimulationObject.tsx";
import Plant from "./Plant.tsx";
import Animal from "./Animal.tsx";
import Vector2 from "./Vector2.tsx";
import AnimalSpecie from "./AnimalSpecie.tsx";
import type PlantParams from "./PlantParams.tsx";
import { randomRange } from "../Utils.tsx";

export default class SimulationField {
    private _width: number;
    private _height: number;
    private _plantParams: PlantParams;
    private _species: AnimalSpecie[];
    private _plants: Map<number, Plant>;
    private _animals: Map<number, Animal>;
    private _lastId: number = 0;
    private _simulationTime: number = 0;
    private _plantSpawnCooldown: number = 0;

    constructor(width: number, height: number, plantParams: PlantParams, species: AnimalSpecie[]) {
        this._width = width;
        this._height = height;
        this._plantParams = plantParams;
        this._species = species;
        this._plants = new Map<number, Plant>();
        this._animals = new Map<number, Animal>();
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get plants() { return this._plants; }
    get animals() { return this._animals; }
    get plantParams() { return this._plantParams; }
    get species() { return this._species; }
    get simulationTime() { return this._simulationTime; }

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
            for (let i = 0; i < this._plantParams.spawnRate; i++) {
                this.addPlant(new Plant(this, Vector2.random(0, this._width, 0, this._height), this._plantParams, this._plantParams.randomStats()));
            }
            this._plantSpawnCooldown = randomRange(0.75, 1.25);
        }
        this._simulationTime += deltaTime;
    }

    renderObjects(selectObject: (object: SimulationObject) => void): React.JSX.Element[] {
        return [...this._plants.values(), ...this._animals.values()].map(obj => obj.render(selectObject));
    }
}