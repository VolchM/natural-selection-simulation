import SimulationObject from "../simulation/SimulationObject";
import Animal from "../simulation/Animal";
import { Sex } from "../simulation/AnimalSpecie";
import Plant from "../simulation/Plant";
import "./ObjectInfo.css";

type ObjectStatProps = {
    label: string,
    value: number,
    max?: number,
    bad?: number,
    good?: number,
}

function ObjectStat({ label, value, max, bad, good }: ObjectStatProps): React.JSX.Element {
    const valueString = max === undefined ? value.toFixed(0) : `${value.toFixed(0)}/${max.toFixed(0)}`
    let hue = null;
    if (bad !== undefined && good !== undefined && bad !== good) {
        hue = (value - bad) / (good - bad) * 120; // Цвет от красного до зелёного
    }

    return (
        <div className="object-stat">
            <span>{label}</span>
            {hue !== null ? <span style={{color: `hsl(${hue}, 100%, 50%)`}}>{valueString}</span>
                          : <span>{valueString}</span>}
        </div>
    );
}

export default function ObjectInfo({object}: {object: SimulationObject | null}): React.JSX.Element {
    if (object instanceof Animal) {
        return (
            <div className="object-info">
                <div>
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <circle cx="15" cy="15" r={object.radius} fill={object.specie.color}></circle>
                    </svg>
                    {object.specie.name}, ID: {object.id}
                </div>
                <div className="object-stat">
                    <span>Пол</span>
                    <span>{object.sex === Sex.Male ? "Мужской" : "Женский"}</span>
                </div>
                <ObjectStat label="Время жизни"
                            value={object.age}
                            max={object.stats.oldAge}
                            bad={object.stats.oldAge}
                            good={0} />
                <ObjectStat label="Выносливость"
                            value={object.stamina}
                            max={object.stats.maxStamina}
                            bad={0}
                            good={object.stats.maxStamina} />
                <ObjectStat label="Сытость"
                            value={object.satiety}
                            max={object.stats.maxSatiety}
                            bad={0}
                            good={object.stats.maxSatiety} />
                <div className="subtitle">Наследуемые характеристики</div>
                <ObjectStat label="Максимальная скорость"
                            value={object.stats.maxSpeed}
                            bad={object.specie.inheritedStats.maxSpeed.min}
                            good={object.specie.inheritedStats.maxSpeed.max} />
                <ObjectStat label="Радиус зрения"
                            value={object.stats.visionRadius}
                            bad={object.specie.inheritedStats.visionRadius.min}
                            good={object.specie.inheritedStats.visionRadius.max} />
                <ObjectStat label="Время старости"
                            value={object.stats.oldAge}
                            bad={object.specie.inheritedStats.oldAge.min}
                            good={object.specie.inheritedStats.oldAge.max} />
                <ObjectStat label="Максимальная выносливость"
                            value={object.stats.maxStamina}
                            bad={object.specie.inheritedStats.maxStamina.min}
                            good={object.specie.inheritedStats.maxStamina.max} />
                <ObjectStat label="Максимальная сытость"
                            value={object.stats.maxSatiety}
                            bad={object.specie.inheritedStats.maxSatiety.min}
                            good={object.specie.inheritedStats.maxSatiety.max} />
                <ObjectStat label="Сытость при съедении"
                            value={object.stats.satietyValue}
                            bad={object.specie.inheritedStats.satietyValue.min}
                            good={object.specie.inheritedStats.satietyValue.max} />
            </div>
        );
    } else if (object instanceof Plant) {
        return (
            <div className="object-info">
                <div>
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <circle cx="15" cy="15" r={object.radius} fill="#1a9e00"></circle>
                    </svg>
                    Растение, ID: {object.id}
                </div>
                <ObjectStat label="Время жизни"
                            value={object.age}
                            max={object.stats.oldAge}
                            bad={object.stats.oldAge}
                            good={0} />
                <ObjectStat label="Сытость при съедении:"
                            value={object.satietyValue}
                            bad={0}
                            good={object.plantParams.satietyValue.max} />
            </div>
        );
    } else {
        return (
            <div className="select-object">
                Нажмите на объект, чтобы увидеть информацию о нём
            </div>
        );
    }
}