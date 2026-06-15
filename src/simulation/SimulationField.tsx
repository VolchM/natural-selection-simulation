import SimulationObject from "./SimulationObject";
import Plant from "./Plant";
import HerbivoreAnimal from "./HerbivoreAnimal";
import CarnivoreAnimal from "./CarnivoreAnimal";

export default class SimulationField {
    private _width: number;
    private _height: number;
    private _objects: Map<number, SimulationObject>;
    private _lastId: number;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._objects = new Map<number, SimulationObject>;
        this._lastId = 0;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get objects() { return this._objects; }

    getNextId(): number {
        this._lastId += 1;
        return this._lastId;
    }

    getObjectById(id: number): SimulationObject | undefined {
        return this._objects.get(id);
    }

    getAllObjects(): SimulationObject[] {
        return [...this._objects.values()];
    }

    getPlants(): Plant[] {
        return this.getAllObjects().filter(obj => obj instanceof Plant);
    }

    getHerbivoreAnimals(): HerbivoreAnimal[] {
        return this.getAllObjects().filter(obj => obj instanceof HerbivoreAnimal);
    }

    getCarivoreAnimals(): CarnivoreAnimal[] {
        return this.getAllObjects().filter(obj => obj instanceof CarnivoreAnimal);
    }

    addObject(obj: SimulationObject) {
        this._objects.set(obj.id, obj);
    }

    removeObject(obj: SimulationObject) {
        this._objects.delete(obj.id);
    }

    update(deltaTime: number) {
        const ids = Array.from(this._objects.keys());
        for (const id of ids) {
            this._objects.get(id)?.update(deltaTime);
        }
    }

    renderObjects(): React.JSX.Element[] {
        return [...this.getPlants(), ...this.getHerbivoreAnimals(), ...this.getCarivoreAnimals()].map(obj => obj.render());
    }
}