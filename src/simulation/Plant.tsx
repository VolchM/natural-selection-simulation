import PlantParams, { type PlantStats } from "./PlantParams.tsx";
import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.tsx";

export default class Plant extends SimulationObject {
    readonly params: PlantParams;
    readonly stats: PlantStats;
    private _age: number;

    constructor(field: SimulationField, pos: Vector2, plantParams: PlantParams, stats: PlantStats, age: number = 0) {
        super(field, pos);

        this.params = plantParams;
        this.stats = stats;
        this._age = age;
    }

    get age() { return this._age; }
    get satietyValue() {
        if (this._age > this.stats.oldAge) {
            return this.stats.satietyValue / ((this._age / this.stats.oldAge) ** 3);
        }
        return this.stats.satietyValue;
    }
    
    get radius() { return this.params.radius * Math.sqrt(this.satietyValue / this.params.satietyValue.mean); }
    get color() { return this.params.color; }

    update(deltaTime: number) {
        this._age += deltaTime;
        if (this.satietyValue < 0.35 * this.params.satietyValue.mean) {
            this.field.removeObjectById(this.id);
        }
    }
}