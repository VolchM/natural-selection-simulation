import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.tsx";

export default class Plant extends SimulationObject {
    constructor(simulationField: SimulationField, pos: Vector2) {
        super(simulationField, pos);
    }

    get radius() { return 5; }

    update(_deltaTime: number) {}

    render() {
        return (
            <circle
                key={this.id}
                cx={this.pos.x}
                cy={this.pos.y}
                r={this.radius}
                fill="#1a9e00"
                cursor="pointer"
                onClick={() => alert("Растение, ID: " + this.id.toString())}
            />
        );
    }
}