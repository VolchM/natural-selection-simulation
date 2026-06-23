import RandomizedStat from "../simulation/RandomizedStat";
import { InputField, NumberInput, RandomizedStatInput } from "./InputFields";
import type { PlantParamsArgs } from "../simulation/PlantParams";
import type { AnimalSpecieArgs, AnimalStatName } from "../simulation/AnimalSpecie";
import "./SimulationParamsInput.css";
import { defaultSimulationParams, type SimulationParams } from "./Simulation";

function PlantParamsInput({ value, onChange }: { value: PlantParamsArgs, onChange: (value: PlantParamsArgs) => void}): React.JSX.Element {
    function handleChange<T extends keyof PlantParamsArgs>(key: T, changedParam: PlantParamsArgs[T]) {
        onChange({
            ...value,
            [key]: changedParam,
        });
    }

    return (
        <div>
            <div className="object-title">
                <svg width="30" height="30" viewBox="0 0 30 30">
                    <circle cx="15" cy="15" r={value.radius} fill={value.color}></circle>
                </svg>
                Растение
            </div>
            <NumberInput label="Начальное количество" value={value.startingCount} min={0} max={500} step={1} onChange={(x) => handleChange("startingCount", x)} />
            <NumberInput label="Частота появления (растений/cек)" value={value.spawnRate} min={0} max={100} step={1} onChange={(x) => handleChange("spawnRate", x)} />
            <RandomizedStatInput label="Сытость при съедении" value={value.satietyValue} min={0} onChange={(x) => handleChange("satietyValue", x)} />
            <RandomizedStatInput label="Время старости (cек)" value={value.oldAge} min={0} onChange={(x) => handleChange("oldAge", x)} />
        </div>
    );
}

function AnimalSpecieInput({ value, onChange }: { value: AnimalSpecieArgs, onChange: (value: AnimalSpecieArgs) => void}): React.JSX.Element {
    function handleChange<T extends keyof AnimalSpecieArgs>(key: T, changedParam: AnimalSpecieArgs[T]) {
        onChange({
            ...value,
            [key]: changedParam,
        });
    }
    function handleStatChange(key: AnimalStatName, changedParam: RandomizedStat) {
        onChange({
            ...value,
            inheritedStats: {
                ...value.inheritedStats,
                [key]: changedParam,
            }
        });
    }
    return (
        <div>
            <div className="object-title">
                <svg width="30" height="30" viewBox="0 0 30 30">
                    <circle cx="15" cy="15" r={value.radius} fill={value.color}></circle>
                </svg>
                {value.name}
            </div>
            <NumberInput label="Начальное количество" value={value.startingCount} min={0} max={500} step={1} onChange={(x) => handleChange("startingCount", x)} />
            <RandomizedStatInput label="Максимальная скорость" value={value.inheritedStats.maxSpeed} min={0} max={500} onChange={(x) => handleStatChange("maxSpeed", x)} />
            <RandomizedStatInput label="Радиус зрения" value={value.inheritedStats.visionRadius} min={0} onChange={(x) => handleStatChange("visionRadius", x)} />
            <RandomizedStatInput label="Макс. выносливость" value={value.inheritedStats.maxStamina} min={0} onChange={(x) => handleStatChange("maxStamina", x)} />
            <RandomizedStatInput label="Макс. сытость" value={value.inheritedStats.maxSatiety} min={0} onChange={(x) => handleStatChange("maxSatiety", x)} />
            <RandomizedStatInput label="Время старости (cек)" value={value.inheritedStats.oldAge} min={0} onChange={(x) => handleStatChange("oldAge", x)} />
            <RandomizedStatInput label="Сытость при съедении" value={value.inheritedStats.satietyValue} min={0} onChange={(x) => handleStatChange("satietyValue", x)} />
            <NumberInput label="Вероятность мутации (%)" value={value.mutationChance * 100} min={0} max={100} step={0.1} onChange={(x) => handleChange("mutationChance", x / 100)} />
            <NumberInput label="Изменение характеристик (%)" value={value.randomDeviation * 100} min={0} max={5} step={0.1} onChange={(x) => handleChange("randomDeviation", x / 100)} />
        </div>
    );
}


export default function SimulationParamsInput({value, onChange, formRef}: { value: SimulationParams, onChange: (value: SimulationParams) => void, formRef: React.Ref<HTMLFormElement>}): React.JSX.Element {
    function handleChange<T extends keyof SimulationParams>(key: T, changedParam: SimulationParams[T]) {
        onChange({
            ...value,
            [key]: changedParam
        })
    }
    function handleSpecieChange(changedIndex: number, changedSpecie: AnimalSpecieArgs) {
        onChange({
            ...value,
            species: value.species.map((specie, index) => changedIndex === index ? changedSpecie : specie)
        })
    }

    return (
        <div className="container simulation-params">
            <h2>Параметры симуляции</h2>
            <div className="note">Для применения перезапустите симуляцию</div>
            <hr/>

            <form ref={formRef}>
                <div className="input-row">
                    <span>Размер поля</span>
                    <div>
                        <InputField value={value.width} min={0} max={10000} step={1} onChange={(x) => handleChange("width", x)} />
                        <span> x </span>
                        <InputField value={value.height} min={0} max={10000} step={1} onChange={(x) => handleChange("height", x)} />
                    </div>
                </div>
                <PlantParamsInput value={value.plantParams} onChange={(x) => handleChange("plantParams", x)} />
                {value.species.map((specie, index) =>
                    <AnimalSpecieInput key={index} value={specie} onChange={(x) => handleSpecieChange(index, x)} />
                )}
                <button className="reset-params" type="button" onClick={() => onChange(defaultSimulationParams)}>Сбросить параметры</button>
            </form>
        </div>
    );
}