import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.ts";

export default class Plant extends SimulationObject {
    constructor(simulationField: SimulationField, pos: Vector2) {
        super(simulationField, pos);
    }

    update() {}

    render() {
        return (
            <circle
                key={this.id}
                cx={this.pos.x}
                cy={this.pos.y}
                r="5"
                fill="#1eac02"
                cursor="pointer"
                onClick={() => alert("Растение, ID: " + this.id.toString())}
            />
        );
    }
}