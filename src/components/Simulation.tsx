import { useEffect, useReducer, useRef, useState } from "react";
import SimulationField from "../simulation/SimulationField.tsx";
import AnimalSpecie, { AnimalDiet, type AnimalSpecieArgs } from "../simulation/AnimalSpecie.tsx";
import RandomizedStat from "../simulation/RandomizedStat.tsx";
import PlantParams, { type PlantParamsArgs } from "../simulation/PlantParams.tsx";
import SimulationObject from "../simulation/SimulationObject.tsx";
import Animal from "../simulation/Animal.tsx";
import SimulationParamsInput from "./SimulationParamsInput.tsx";
import SimulationControls from "./SimulationControls.tsx";
import SimulationStats from "./SimulationStats.tsx";
import ObjectInfo from "./ObjectInfo.tsx";
import plusIcon from "../assets/plus.svg";
import minusIcon from "../assets/minus.svg";
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

export default function Simulation({ targetFPS }: { targetFPS: number }): React.JSX.Element {
    const [simulationParams, setSimulationParams] = useState(defaultSimulationParams);
    const [field, setField] = useState(createField(simulationParams));
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1.0);
    const [,redrawField] = useReducer((tick) => tick + 1, 0);
    const formRef = useRef<HTMLFormElement>(null);

    function selectObject(object: SimulationObject) {
        setSelectedObjectId(object.id);
    }
    function deselectObject() {
        setSelectedObjectId(null);
    }

    function handleReset() {
        if (formRef.current?.reportValidity()) {
            setField(createField(simulationParams));
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
                redrawField();
            }
            requestID = requestAnimationFrame(step);
        }

        return () => cancelAnimationFrame(requestID);
    }, [field, targetFPS, paused, speed]);

    const speciesCount = field.species.map(curSpecie => ({
        specie: curSpecie,
        count: [...field.animals.values()].filter(animal => animal.specie === curSpecie).length
    }));

    let selectedObject: SimulationObject | null = null;
    if (selectedObjectId !== null) {
        selectedObject = field.getObjectById(selectedObjectId) ?? null;
        if (selectedObject == null) setSelectedObjectId(null);
    }

    const selectedObjectGraphics: React.JSX.Element[] = [];
    if (selectedObject !== null) {
        selectedObjectGraphics.push(<circle key="outline" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.radius+3} fill="none" stroke="white" strokeWidth="2" />)
        if (selectedObject instanceof Animal) {
            selectedObjectGraphics.push(<circle key="vision-radius" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.stats.visionRadius} fill="none" stroke="#ffffff60" strokeWidth="2" strokeDasharray="10 20" />)
        }
    }

    return (
        <div className="simulation">
            <SimulationParamsInput value={simulationParams} onChange={setSimulationParams} formRef={formRef} />
            <div className="container field-container">
                <div className="field-scroll">
                    <svg className="field" width={field.width * zoom} height={field.height * zoom} viewBox={`0 0 ${field.width} ${field.height}`}>
                        <rect width="100%" height="100%" fill="transparent" onClick={deselectObject}/>
                        {field.renderObjects(selectObject)}
                        {selectedObjectGraphics}
                    </svg>
                </div>
                <button className="zoom-button zoom-plus" onClick={() => setZoom(zoom * 1.2)}><img src={plusIcon} /></button>
                <button className="zoom-button zoom-minus" onClick={() => setZoom(zoom / 1.2)}><img src={minusIcon} /></button>
            </div>
            <div className="container simulation-info">
                <SimulationControls paused={paused} onPausedChange={setPaused}
                                    onReset={handleReset}
                                    speed={speed} onSpeedChange={setSpeed} />
                <hr/>
                <SimulationStats simulationTime={field.simulationTime} plantsCount={field.plants.size} speciesCount={speciesCount} />
                <hr/>
                <ObjectInfo object={selectedObject} />
            </div>
        </div>
    );
}
