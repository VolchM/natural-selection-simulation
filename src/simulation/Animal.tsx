import AnimalSpecie, { AnimalDiet, Sex, type AnimalStats } from "./AnimalSpecie.tsx";
import Plant from "./Plant.tsx";
import SimulationField from "./SimulationField.tsx";
import SimulationObject from "./SimulationObject.tsx"
import Vector2 from "./Vector2.tsx";
import { clamp, randomRange } from "../Utils.tsx";

export default class Animal extends SimulationObject {
    private _specie: AnimalSpecie;
    private _stats: AnimalStats;

    private _stamina: number;
    private _satiety: number;
    private _age: number;
    private _sex: Sex;

    private _direction: Vector2;
    private _speedMult: number = 1.0;

    private _reproductionTimer: number = 0.0;
    private _directionChangeTimer: number = 0.0;
    private _restTimer: number = 0.0;
    private _lastSeenPartnerPos: Vector2 | null = null;

    constructor(field: SimulationField, pos: Vector2, specie: AnimalSpecie, stats: AnimalStats, age: number) {
        super(field, pos);

        this._specie = specie;
        this._stats = stats;
        this._stamina = randomRange(0.75, 1.0) * this._stats.maxStamina;
        this._satiety = randomRange(0.75, 1.0) * this._stats.maxSatiety;
        this._age = age;
        this._sex = Math.random() < 0.5 ? Sex.Male : Sex.Female;

        this._direction = Vector2.randomDirection();
    }

    get specie() { return this._specie; }
    get stats() { return this._stats; }
    get radius() { return this._specie.radius; }

    get stamina() { return this._stamina; }
    get satiety() { return this._satiety; }
    get age() { return this._age; }
    get sex() { return this._sex; }
    get reproductionTimer() { return this._reproductionTimer; }

    update(deltaTime: number) {
        this.animalBehaviour(deltaTime);

        const currentSpeed = this._speedMult * this._stats.maxSpeed * (1/3 + (this._stamina / this._stats.maxStamina) * 2/3);
        let staminaLoss = 12 * (currentSpeed / this._stats.maxSpeed);
        const staminaRegeneration = 15 * (1 - currentSpeed / this._stats.maxSpeed) * (this._satiety / this._stats.maxSatiety) ** (1/3);
        let satietyLoss = this._specie.satietyLoss;
        if (this._age > this._stats.oldAge) {
            staminaLoss = staminaLoss * (this._age + 1 - this._stats.oldAge) ** (1/3);
            satietyLoss = satietyLoss * (this._age + 1 - this._stats.oldAge) ** (1/3);
        }

        this._age += deltaTime;
        this._reproductionTimer = Math.max(this._reproductionTimer - deltaTime, 0);
        this._stamina = clamp(this._stamina + (staminaRegeneration - staminaLoss) * deltaTime, 0, this._stats.maxStamina);
        this._satiety = clamp(this._satiety - satietyLoss * deltaTime, 0, this._stats.maxSatiety);
        if (this._satiety <= 0) {
            // При полном отсутствии сытости животное умирает
            this.field.removeObjectById(this.id);
        }

        const newPos = this.pos.add(this._direction.mult(currentSpeed * deltaTime));
        if (newPos.x < -this.radius) { newPos.x = this.field.width + this.radius; }
        if (newPos.x > this.field.width + this.radius) { newPos.x = -this.radius; }
        if (newPos.y < -this.radius) { newPos.y = this.field.height + this.radius; }
        if (newPos.y > this.field.height + this.radius) { newPos.y = -this.radius; }
        this.moveTo(newPos);
    }

    render(selectObject: (object: SimulationObject) => void): React.JSX.Element {
        return (
            <circle
                key={this.id}
                cx={this.pos.x}
                cy={this.pos.y}
                r={this._specie.radius}
                fill={this._specie.color}
                cursor="pointer"
                onClick={() => selectObject(this)}
            />
        );
    }

    canReproduce() {
        return this._age >= this._specie.reproductionCooldown * 1.5
               && this._reproductionTimer <= 0
               && this._satiety >= 0.65 * this._stats.maxSatiety;
    }

    reproduce() {
        this._satiety -= this._specie.reproductionCost;
        this._reproductionTimer = this._specie.reproductionCooldown;
    }

    private animalBehaviour(deltaTime: number) {
        this._restTimer -= deltaTime;
        if (this._restTimer > 0) {
            // Отдыхать
            this._speedMult = 0.0;
            return;
        }

        if (this._stamina <= 0.05 * this._stats.maxStamina) {
            // Остановиться отдохнуть при почти полном отсутствии выносливости
            this._restTimer = randomRange(0.5, 1.0);
            this._speedMult = 0.0;
            return;
        }

        const closestPotentialPartner: Animal | null = this.closestInVisionRange(
            this.field.animals.values(),
            animal => animal.specie.name == this._specie.name && animal.sex != this._sex
        );
        if (closestPotentialPartner !== null) {
            this._lastSeenPartnerPos = closestPotentialPartner.pos;
        }

        const closestPredator: Animal | null = this.closestInVisionRange(
            this.field.animals.values(),
            animal => animal.specie.isEating(this._specie.name)
        );
        if (closestPredator !== null) {
            // Рядом хищник, убегать от него
            this._speedMult = 1.0;
            this._direction = closestPredator.pos.directionTo(this.pos);
            return;
        }

        if (this._specie.diet == AnimalDiet.Herbivore) {
            const closestPlant: Plant | null = this.closestInVisionRange(this.field.plants.values());
            if (closestPlant !== null && (this._stats.maxSatiety - this._satiety >= 0.7 * closestPlant.satietyValue)) {
                if (this.pos.distanceTo(closestPlant.pos) <= Math.max(this.radius, closestPlant.radius)) {
                    // Съесть растение
                    this.eat(closestPlant.satietyValue);
                    this.field.removeObjectById(closestPlant.id);
                } else {
                    // Рядом растение, идти к нему
                    this._speedMult = 0.85;
                    this._direction = this.pos.directionTo(closestPlant.pos);
                }
                return;
            }
        } else if (this._specie.diet == AnimalDiet.Carnivore) {
            const closestPrey: Animal | null = this.closestInVisionRange(
                this.field.animals.values(),
                animal => this._specie.isEating(animal.specie.name)
            );
            if (closestPrey !== null && (this._stats.maxSatiety - this._satiety >= 0.7 * closestPrey.stats.satietyValue)) {
                if (this.pos.distanceTo(closestPrey.pos) <= Math.max(this.radius, closestPrey.radius)) {
                    // Съесть добычу
                    this.eat(closestPrey._stats.satietyValue);
                    this.field.removeObjectById(closestPrey.id);
                } else {
                    // Рядом добыча, бежать за ней
                    this._speedMult = 1.0;
                    this._direction = this.pos.directionTo(closestPrey.pos);
                }
                return;
            }
        }

        if (this._stamina <= 0.3 * this._stats.maxStamina) {
            // Остановиться отдохнуть при малой выносливости
            this._speedMult = 0;
            this._restTimer = randomRange(1.0, 2.0);
            return;
        } else if (this._satiety <= 0.45 * this._stats.maxSatiety) {
            // Искать еду с повышенной скоростью
            this.moveRandomly(deltaTime, 0.8);
            return;
        }

        if (this.canReproduce()) {
            const closestPartner: Animal | null = this.closestInVisionRange(
                this.field.animals.values(),
                animal => this._specie.name == animal.specie.name
                          && this._sex != animal.sex
                          && animal.canReproduce()
            );
            if (closestPartner !== null) {
                if (this.pos.distanceTo(closestPartner.pos) <= Math.max(this.radius, closestPartner.radius)) {
                    // Создать потомство
                    this.reproduce();
                    closestPartner.reproduce();
                    this.field.addAnimal(new Animal(
                        this.field,
                        this.pos.add(Vector2.randomDirection().mult(5)),
                        this._specie,
                        this._specie.mixAnimalStats(this._stats, closestPartner.stats),
                        0,
                    ));
                } else {
                    // Идти к животному для размножения
                    this._speedMult = 0.7;
                    this._direction = this.pos.directionTo(closestPartner.pos);
                }
            } else {
                // Искать партнёра
                if (this._lastSeenPartnerPos !== null) {
                    if (this.pos.distanceTo(this._lastSeenPartnerPos) > this._stats.visionRadius) {
                        this._direction = this.pos.directionTo(this._lastSeenPartnerPos);
                    }
                    this._lastSeenPartnerPos = null;
                }
                this.moveRandomly(deltaTime, 0.6);
            }
            return;
        }

        // Иначе - медленно ходить по полю
        this.moveRandomly(deltaTime, 0.35);
    }

    private moveRandomly(deltaTime: number, speedMult: number) {
        this._speedMult = speedMult;

        // Случайная смена направления
        this._directionChangeTimer -= deltaTime;
        if (this._directionChangeTimer <= 0) {
            this._direction = this._direction.rotatedBy(randomRange(- (Math.PI / 3), Math.PI / 3));
            this._directionChangeTimer = randomRange(0.5, 1.2);
        }
    }

    private closestInVisionRange<Type extends SimulationObject>(objects: Iterable<Type>, filter?: (obj: Type) => boolean): Type | null {
        let minDistance: number = Infinity;
        let closestObject: Type | null = null;
        for (const obj of objects) {
            if (filter === undefined || filter(obj)) {
                const distance = this.pos.distanceTo(obj.pos);
                if (distance <= this._stats.visionRadius + obj.radius && distance <= minDistance) {
                    minDistance = distance;
                    closestObject = obj;
                }
            }
        }
        return closestObject;
    }

    private eat(satietyValue: number) {
        this._satiety = clamp(this._satiety + satietyValue, 0, this._stats.maxSatiety);
    }
}
