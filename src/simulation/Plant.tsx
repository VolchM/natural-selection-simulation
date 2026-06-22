import PlantParams from "./PlantParams.tsx";
import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.tsx";

export default class Plant extends SimulationObject {
    private _plantParams: PlantParams;
    private _age: number;

    constructor(field: SimulationField, pos: Vector2, plantParams: PlantParams, age: number = 0) {
        super(field, pos);

        this._plantParams = plantParams;
        this._age = age;
    }

    get age() { return this._age; }
    get plantParams() { return this._plantParams; }
    get radius() { return this._plantParams.radius * Math.sqrt(this.satietyValue / this._plantParams.satietyValue); }
    get satietyValue() {
        if (this._age > this._plantParams.oldAge) {
            return this._plantParams.satietyValue / ((this._age / this._plantParams.oldAge) ** 3);
        }
        return this._plantParams.satietyValue;
    }

    update(deltaTime: number) {
        this._age += deltaTime;
        if (this.satietyValue < 0.35 * this._plantParams.satietyValue) {
            this.field.removeObjectById(this.id);
        }
    }

    render(selectObject: (object: SimulationObject) => void) {
        return (
            <circle
                key={this.id}
                cx={this.pos.x}
                cy={this.pos.y}
                r={this.radius}
                fill={this._plantParams.color}
                cursor="pointer"
                onClick={() => selectObject(this)}
            />
        );
    }
}