import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.tsx";

export default class Plant extends SimulationObject {
    private _satietyValue: number;

    constructor(field: SimulationField, pos: Vector2, satietyValue: number) {
        super(field, pos);

        this._satietyValue = satietyValue;
    }

    get satietyValue() { return this._satietyValue; }
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