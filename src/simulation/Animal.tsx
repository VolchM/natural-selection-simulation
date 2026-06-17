import AnimalSpecie, { AnimalDiet, Sex } from "./AnimalSpecie.tsx";
import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.tsx";

export default class Animal extends SimulationObject {
    private _specie: AnimalSpecie;

    private _stamina: number;
    private _satiety: number;
    private _age: number;
    private _sex: Sex;

    private _direction: Vector2;
    private _speed: number;

    private _directionChangeTimer: number = 0.0;

    constructor(simulationField: SimulationField, pos: Vector2, specie: AnimalSpecie) {
        super(simulationField, pos);

        this._specie = specie;
        this._stamina = specie.maxStamina;
        this._satiety = specie.maxSatiety;
        this._age = 0;
        this._sex = Math.random() < 0.5 ? Sex.Male : Sex.Female;

        this._direction = Vector2.randomDirection();
        this._speed = 0;
    }

    get specie() { return this._specie; }
    get radius() { return this._specie.radius; }

    get stamina() { return this._stamina; }
    get satiety() { return this._satiety; }
    get age() { return this._age; }
    get sex() { return this._sex; }

    update(deltaTime: number) {
        this._speed = this._specie.maxSpeed;

        this._directionChangeTimer -= deltaTime;
        if (this._directionChangeTimer <= 0) {
            this._direction = this._direction.rotatedBy((Math.random() - 0.5) * Math.PI);
            this._directionChangeTimer = Math.random() * 1.0 + 0.3;
        }

        this.moveTo(this.pos.add(this._direction.mult(this._speed * deltaTime)));
    }

    render(): React.JSX.Element {
        return (
            <circle
                key={this.id}
                cx={this.pos.x}
                cy={this.pos.y}
                r={this._specie.radius}
                fill={this._specie.color}
                cursor="pointer"
                onClick={() => alert(
                    (this._specie.diet == AnimalDiet.Herbivore ? "Травоядное" : "Плотоядное")
                    + ` животное вида ${this._specie.name}, ID: ${this.id.toString()}`
                )}
            />
        );
    }
}