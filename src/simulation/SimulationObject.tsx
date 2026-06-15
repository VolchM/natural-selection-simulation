import SimulationField from "./SimulationField";
import Vector2 from "./Vector2";

export default abstract class SimulationObject {
    private _simulationField: SimulationField;
    private _id: number;
    private _pos: Vector2;

    constructor(simulationField: SimulationField, pos: Vector2) {
        this._simulationField = simulationField;
        this._id = this._simulationField.getNextId();
        this._pos = pos;
    }

    get field() { return this._simulationField; }
    get id() { return this._id; }
    get pos() { return this._pos; }

    moveTo(pos: Vector2) {
        this._pos = pos;
    }

    abstract update(deltaTime: number): void;
    abstract render(): React.JSX.Element;
}
