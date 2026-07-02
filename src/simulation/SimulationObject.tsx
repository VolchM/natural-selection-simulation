import SimulationField from "./SimulationField.tsx";
import Vector2 from "./Vector2.tsx";

export default abstract class SimulationObject {
    readonly field: SimulationField;
    readonly id: number;
    private _pos: Vector2;

    constructor(field: SimulationField, pos: Vector2) {
        this.field = field;
        this.id = this.field.getNextId();
        this._pos = pos;
    }

    get pos() { return this._pos; }

    moveTo(pos: Vector2) {
        this._pos = pos;
    }

    abstract get radius(): number;
    abstract get color(): string;
    abstract update(deltaTime: number): void;
}
