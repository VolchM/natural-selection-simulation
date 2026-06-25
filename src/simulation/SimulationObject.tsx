import SimulationField from "./SimulationField.tsx";
import Vector2 from "./Vector2.tsx";

export default abstract class SimulationObject {
    private _field: SimulationField;
    private _id: number;
    private _pos: Vector2;

    constructor(field: SimulationField, pos: Vector2) {
        this._field = field;
        this._id = this._field.getNextId();
        this._pos = pos;
    }

    get field() { return this._field; }
    get id() { return this._id; }
    get pos() { return this._pos; }
    abstract get radius(): number;
    abstract get color(): string;

    abstract update(deltaTime: number): void;

    moveTo(pos: Vector2) {
        this._pos = pos;
    }
}
