import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.ts";

export default abstract class Animal extends SimulationObject {
    private _vel: Vector2;

    constructor(simulationField: SimulationField, pos: Vector2) {
        super(simulationField, pos);

        this._vel = Vector2.randomDirection().mult(50);
    }

    update(deltaTime: number) {
        this.moveTo(this.pos.add(this._vel.mult(deltaTime)));
    }
}