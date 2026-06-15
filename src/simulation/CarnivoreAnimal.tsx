import SimulationField from "./SimulationField.tsx";
import Animal from "./Animal.tsx";
import Vector2 from "./Vector2.ts";

export default class CarnivoreAnimal extends Animal {
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
                fill="red"
                cursor="pointer"
                onClick={() => alert("Плотоядное животное, ID: " + this.id.toString())}
            />
        );
    }
}