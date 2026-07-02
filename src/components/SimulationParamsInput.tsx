import RandomizedStat from "../simulation/RandomizedStat.ts";
import type { PlantParamsArgs } from "../simulation/PlantParams.ts";
import type { AnimalSpecieArgs, AnimalStatName } from "../simulation/AnimalSpecie.ts";
import { defaultSimulationParams, type SimulationParams } from "./Simulation.tsx";
import { NumberInputField, NumberInputRow, RandomizedStatInputRow, TextInputField, SelectInputRow, ColorPickerRow } from "./InputFields.tsx";
import deleteIcon from "../assets/delete.svg";
import plusIcon from "../assets/plus.svg";
import "./SimulationParamsInput.css";


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
            <NumberInputRow label="Начальное количество" value={value.startingCount} min={0} max={500} step={1} onChange={(x) => handleChange("startingCount", x)} />
            <NumberInputRow label="Частота появления (растений/cек)" value={value.spawnRate} min={0} max={100} step={1} onChange={(x) => handleChange("spawnRate", x)} />
            <RandomizedStatInputRow label="Сытость при съедении" value={value.satietyValue} min={0} onChange={(x) => handleChange("satietyValue", x)} />
            <RandomizedStatInputRow label="Время старости (cек)" value={value.oldAge} min={0} onChange={(x) => handleChange("oldAge", x)} />
        </div>
    );
}

type AnimalSpecieInputProps = {
    value: AnimalSpecieArgs,
    onChange: (value: AnimalSpecieArgs) => void,
    onDelete: () => void,
    eatsOptions: string[]
};

function AnimalSpecieInput({ value, onChange, onDelete, eatsOptions }: AnimalSpecieInputProps): React.JSX.Element {
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
                <TextInputField value={value.name} onChange={(x) => handleChange("name", x)} maxLength={25} />
                <button className="delete-button" type="button" title="Удалить вид" onClick={onDelete}><img src={deleteIcon} /></button>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "-5px"}}>
                <NumberInputRow label="Радиус" value={value.radius} min={1} max={15} onChange={(x) => handleChange("radius", x)} />
                <ColorPickerRow label="Цвет" value={value.color} onChange={(x) => handleChange("color", x)} />
            </div>
            <SelectInputRow label="Ест" options={eatsOptions.filter(option => option != value.name)} value={value.eats} onChange={(x) => handleChange("eats", x)}/>
            <NumberInputRow label="Начальное количество" value={value.startingCount} min={0} max={500} step={1} onChange={(x) => handleChange("startingCount", x)} />
            <RandomizedStatInputRow label="Макс. скорость" value={value.inheritedStats.maxSpeed} min={0} max={500} onChange={(x) => handleStatChange("maxSpeed", x)} />
            <RandomizedStatInputRow label="Радиус зрения" value={value.inheritedStats.visionRadius} min={0} onChange={(x) => handleStatChange("visionRadius", x)} />
            <RandomizedStatInputRow label="Макс. выносливость" value={value.inheritedStats.maxStamina} min={0} onChange={(x) => handleStatChange("maxStamina", x)} />
            <RandomizedStatInputRow label="Макс. сытость" value={value.inheritedStats.maxSatiety} min={0} onChange={(x) => handleStatChange("maxSatiety", x)} />
            <RandomizedStatInputRow label="Время старости (cек)" value={value.inheritedStats.oldAge} min={0} onChange={(x) => handleStatChange("oldAge", x)} />
            <RandomizedStatInputRow label="Сытость при съедении" value={value.inheritedStats.satietyValue} min={0} onChange={(x) => handleStatChange("satietyValue", x)} />
            <NumberInputRow label="Уменьшение сытости в сек" value={value.satietyLoss} min={0} step={0.1} onChange={(x) => handleChange("satietyLoss", x)} />
            <NumberInputRow label="Пауза между размножениями (сек)" value={value.reproductionCooldown} min={0} onChange={(x) => handleChange("reproductionCooldown", x)} />
            <NumberInputRow label="Трата сытости при размножении" value={value.reproductionCost} min={0} onChange={(x) => handleChange("reproductionCost", x)} />
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
        const newValue = {
            ...value,
            species: value.species.map((specie, index) => changedIndex === index ? changedSpecie : specie)
        };
        if (value.species[changedIndex].name != changedSpecie.name) {
            newValue.species = newValue.species.map(specie =>
                ({
                    ...specie,
                    eats: specie.eats.map(el => el == value.species[changedIndex].name ? changedSpecie.name : el),
                })
            );
        }
        onChange(newValue);
    }
    function handleSpecieDelete(deletedIndex: number) {
        onChange({
            ...value,
            species: value.species.filter((_, index) => index !== deletedIndex)
        });
    }
    function handleSpecieAdd() {
        let name = "Новый вид";
        let count = 1;
        while (value.species.filter(specie => specie.name === name).length !== 0) {
            name = `Новый вид ${count}`;
            count++;
        }

        onChange({
            ...value,
            species: [
                ...value.species,
                {
                    name: name,
                    eats: [],
                    startingCount: 50,
                    inheritedStats: {
                        maxSpeed: new RandomizedStat(50, 6),
                        visionRadius: new RandomizedStat(100, 15),
                        maxStamina: new RandomizedStat(75, 15),
                        maxSatiety: new RandomizedStat(100, 20),
                        oldAge: new RandomizedStat(150, 15),
                        satietyValue: new RandomizedStat(50, 10),
                    },
                    satietyLoss: 2,
                    reproductionCooldown: 15,
                    reproductionCost: 15,
                    mutationChance: 0.2,
                    randomDeviation: 0.01,
                    radius: 8,
                    color: "#ffffff",
                }
            ]
        });
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
                        <NumberInputField value={value.width} min={0} max={10000} step={1} onChange={(x) => handleChange("width", x)} />
                        <span> x </span>
                        <NumberInputField value={value.height} min={0} max={10000} step={1} onChange={(x) => handleChange("height", x)} />
                    </div>
                </div>
                <PlantParamsInput value={value.plantParams} onChange={(x) => handleChange("plantParams", x)} />
                {value.species.map((specie, index) =>
                    <AnimalSpecieInput key={index} value={specie} onChange={(x) => handleSpecieChange(index, x)} onDelete={() => handleSpecieDelete(index)} eatsOptions={["Растение", ...value.species.map(specie => specie.name)]}/>
                )}
                <button className="add-button" type="button" title="Добавить вид" onClick={handleSpecieAdd}><img src={plusIcon} /></button>
                <button className="reset-params" type="button" onClick={() => onChange(defaultSimulationParams)}>Сбросить параметры</button>
            </form>
        </div>
    );
}