import SimulationField from "./SimulationField.tsx";
import Animal from "./Animal.tsx";
import Vector2 from "./Vector2.ts";

export default class HerbivoreAnimal extends Animal {
    constructor(simulationField: SimulationField, pos: Vector2) {
        super(simulationField, pos);
    }

    render(): React.JSX.Element {
        return (
            <circle
                key={this.id}
                cx={this.pos.x}
                cy={this.pos.y}
                r="7"
                fill="#e7bd00"
                cursor="pointer"
                onClick={() => alert("Травоядное животное, ID: " + this.id.toString())}
            />
        );
    }
}