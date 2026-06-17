import SimulationObject from "./SimulationObject.tsx";
import Plant from "./Plant.tsx";
import Animal from "./Animal.tsx";

export default class SimulationField {
    private _width: number;
    private _height: number;
    private _plants: Map<number, Plant>;
    private _animals: Map<number, Animal>;
    private _lastId: number = 0;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._plants = new Map<number, Plant>();
        this._animals = new Map<number, Animal>();
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get plants() { return this._plants; }
    get animals() { return this._animals; }

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
    }

    renderObjects(): React.JSX.Element[] {
        return [...this._plants.values(), ...this._animals.values()].map(obj => obj.render());
    }
}