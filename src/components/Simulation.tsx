import { useEffect, useReducer, useRef, useState } from "react";
import SimulationField from "../simulation/SimulationField.tsx";
import SimulationObject from "../simulation/SimulationObject.tsx";
import AnimalSpecie, { AnimalDiet, type AnimalSpecieArgs } from "../simulation/AnimalSpecie.tsx";
import RandomizedStat from "../simulation/RandomizedStat.tsx";
import PlantParams, { type PlantParamsArgs } from "../simulation/PlantParams.tsx";
import SimulationFieldView from "./SimulationFieldView.tsx";
import SimulationParamsInput from "./SimulationParamsInput.tsx";
import SimulationControls from "./SimulationControls.tsx";
import SimulationStats, { type SimulationStep } from "./SimulationStats.tsx";
import ObjectInfo from "./ObjectInfo.tsx";
import SimulationHistoryGraph, { type SimulationHistory } from "./SimulationHistoryGraph.tsx";
import "./Simulation.css";

export type SimulationParams = {
    width: number,
    height: number,
    plantParams: PlantParamsArgs,
    species: AnimalSpecieArgs[]
}

export const defaultSimulationParams: SimulationParams = {
    width: 1400,
    height: 1400,
    plantParams: {
        startingCount: 40,
        spawnRate: 6,
        satietyValue: new RandomizedStat(50, 10),
        oldAge: new RandomizedStat(30, 5),
        radius: 5,
        color: "#1a9e00"
    },
    species: [
        {
            name: "Травоядное",
            diet: AnimalDiet.Herbivore,
            startingCount: 80,
            inheritedStats: {
                maxSpeed: new RandomizedStat(50, 8),
                visionRadius: new RandomizedStat(90, 10),
                maxStamina: new RandomizedStat(70, 12),
                maxSatiety: new RandomizedStat(100, 15),
                oldAge: new RandomizedStat(220, 30),
                satietyValue: new RandomizedStat(70, 10),
            },
            satietyLoss: 2,
            reproductionCooldown: 12,
            reproductionCost: 15,
            mutationChance: 0.2,
            randomDeviation: 0.02,
            radius: 7,
            color: "#ecd400",
        },
        {
            name: "Плотоядное",
            diet: AnimalDiet.Carnivore,
            eats: ["Травоядное"],
            startingCount: 20,
            inheritedStats: {
                maxSpeed: new RandomizedStat(80, 10),
                visionRadius: new RandomizedStat(100, 10),
                maxStamina: new RandomizedStat(100, 15),
                maxSatiety: new RandomizedStat(120, 18),
                oldAge: new RandomizedStat(180, 20),
                satietyValue: new RandomizedStat(80, 15),
            },
            satietyLoss: 2.5,
            reproductionCooldown: 25,
            reproductionCost: 20,
            mutationChance: 0.2,
            randomDeviation: 0.02,
            radius: 9,
            color: "#e20000",
        }
    ]
}

function createField(simulationParams: SimulationParams): SimulationField {
    return new SimulationField(
        simulationParams.width,
        simulationParams.height,
        new PlantParams(simulationParams.plantParams),
        simulationParams.species.map(args => new AnimalSpecie(args))
    );
}

function getSimulationStep(field: SimulationField): SimulationStep {
    const speciesCount = field.species.map(curSpecie => ({
        specie: curSpecie,
        count: [...field.animals.values()].filter(animal => animal.specie === curSpecie).length
    }));
    return {
        simulationTime: field.simulationTime,
        plantsCount: field.plants.size,
        speciesCount: speciesCount
    };
}

export default function Simulation({ targetFPS }: { targetFPS: number }): React.JSX.Element {
    const [simulationParams, setSimulationParams] = useState(defaultSimulationParams);
    const [field, setField] = useState(createField(simulationParams));
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
    const [tempSelectedObjectId, setTempSelectedObjectId] = useState<number | null>(null);
    const [simulationHistory, setSimulationHistory] = useState<SimulationHistory>([getSimulationStep(field)]);
    const [,redrawField] = useReducer((tick) => tick + 1, 0);
    const formRef = useRef<HTMLFormElement>(null);

    function handleReset() {
        if (formRef.current?.reportValidity()) {
            const field = createField(simulationParams);
            setField(field);
            setSimulationHistory([getSimulationStep(field)]);
        }
    }

    // Цикл обновления симуляции
    useEffect(() => {
        if (paused) return;

        const targetFrameLength = 1 / targetFPS;

        let requestID = requestAnimationFrame(step);
        let lastTimestamp = performance.now();

        function step(timestamp: number) {
            if (lastTimestamp === undefined) {
                lastTimestamp = timestamp;
                requestID = requestAnimationFrame(step);
                return;
            }

            const deltaTime = (timestamp - lastTimestamp) / 1000;
            if (deltaTime >= targetFrameLength - 0.0003) {
                lastTimestamp = timestamp;
                if (deltaTime <= 0.2) {
                    field.update(deltaTime * speed);
                } else {
                    // Окно не было активным
                    field.update(targetFrameLength * speed);
                }
                simulationHistory.push(getSimulationStep(field));
                redrawField();
            }
            requestID = requestAnimationFrame(step);
        }

        return () => cancelAnimationFrame(requestID);
    }, [field, targetFPS, paused, speed, simulationHistory]);

    let selectedObject: SimulationObject | null = selectedObjectId === null ? null : field.getObjectById(selectedObjectId) ?? null;
    if (selectedObject === null) {
        selectedObject = tempSelectedObjectId === null ? null : field.getObjectById(tempSelectedObjectId) ?? null;
    }

    return (
        <div className="simulation">
            <SimulationParamsInput value={simulationParams} onChange={setSimulationParams} formRef={formRef} />
            <SimulationFieldView field={field}
                                 selectedObjectId={selectedObjectId} setSelectedObjectId={setSelectedObjectId}
                                 tempSelectedObjectId={tempSelectedObjectId} setTempSelectedObjectId={setTempSelectedObjectId} />
            <div className="container simulation-info">
                <SimulationControls paused={paused} onPausedChange={setPaused}
                                    onReset={handleReset}
                                    speed={speed} onSpeedChange={setSpeed} />
                <hr/>
                <SimulationStats simulationStep={simulationHistory.at(-1)!} />
                <hr/>
                <SimulationHistoryGraph simulationHistory={simulationHistory} minWidth={250} maxWidth={400} minHeight={150} maxHeight={400}/>
                <hr/>
                <ObjectInfo object={selectedObject} />
            </div>
        </div>
    );
}
