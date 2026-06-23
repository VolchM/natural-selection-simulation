import { useEffect, useReducer, useState } from "react";
import SimulationField from "../simulation/SimulationField.tsx";
import Plant from "../simulation/Plant.tsx";
import Vector2 from '../simulation/Vector2.tsx';
import AnimalSpecie, { AnimalDiet } from "../simulation/AnimalSpecie.tsx";
import RandomizedStat from "../simulation/RandomizedStat.tsx";
import PlantParams from "../simulation/PlantParams.tsx";
import SimulationObject from "../simulation/SimulationObject.tsx";
import Animal from "../simulation/Animal.tsx";
import { randomRange } from "../Utils.tsx";
import SimulationParams from "./SimulationParams.tsx";
import SimulationControls from "./SimulationControls.tsx";
import SimulationStats from "./SimulationStats.tsx";
import ObjectInfo from "./ObjectInfo.tsx";
import plusIcon from "../assets/plus.svg";
import minusIcon from "../assets/minus.svg";
import "./Simulation.css";

function createField(width: number, height: number): SimulationField {
    const plantParams = new PlantParams({
        startingCount: 40,
        spawnRate: 5,
        satietyValue: 50,
        oldAge: 30,
        radius: 5,
        color: "#1a9e00"
    });
    const herbivoreSpecie = new AnimalSpecie({
        name: "Травоядное",
        diet: AnimalDiet.Herbivore,
        inheritedStats: {
            maxSpeed: new RandomizedStat(50, 10),
            visionRadius: new RandomizedStat(90, 10),
            maxSatiety: new RandomizedStat(100, 15),
            maxStamina: new RandomizedStat(70, 12),
            oldAge: new RandomizedStat(120, 20),
            satietyValue: new RandomizedStat(70, 10),
        },
        mutationChance: 0.15,
        randomDeviation: 0.02,
        radius: 7,
        color: "#ecd400",
    });
    const carnivoreSpecie = new AnimalSpecie({
        name: "Плотоядное",
        diet: AnimalDiet.Carnivore,
        eats: ["Травоядное"],
        inheritedStats: {
            maxSpeed: new RandomizedStat(75, 10),
            visionRadius: new RandomizedStat(90, 10),
            maxSatiety: new RandomizedStat(120, 18),
            maxStamina: new RandomizedStat(80, 15),
            oldAge: new RandomizedStat(90, 15),
            satietyValue: new RandomizedStat(80, 15),
        },
        mutationChance: 0.15,
        randomDeviation: 0.02,
        radius: 9,
        color: "#e20000",
    });

    const field = new SimulationField(width, height, plantParams, [herbivoreSpecie, carnivoreSpecie]);
    for (let i = 0; i < plantParams.startingCount; i++) {
        field.addPlant(new Plant(field, Vector2.random(0, field.width, 0, field.height), plantParams, randomRange(0, 0.75 * plantParams.oldAge)));
    }
    for (let i = 0; i < 60; i++) {
        const stats = herbivoreSpecie.randomStats();
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), herbivoreSpecie, stats, randomRange(0, 0.75 * stats.oldAge)));
    }
    for (let i = 0; i < 18; i++) {
        const stats = carnivoreSpecie.randomStats();
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), carnivoreSpecie, stats, randomRange(0, 0.75 * stats.oldAge)));
    }
    return field;
}

type SimulationProps = {
    targetFPS: number,
}

export default function Simulation({ targetFPS }: SimulationProps): React.JSX.Element {
    const width = 1500, height = 1200;
    const [field, setField] = useState(createField(width, height));
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1.0);
    const [,redrawField] = useReducer((tick) => tick + 1, 0);

    function selectObject(object: SimulationObject) {
        setSelectedObjectId(object.id);
    }
    function deselectObject() {
        setSelectedObjectId(null);
    }

    let selectedObject: SimulationObject | null = null;
    if (selectedObjectId !== null) {
        selectedObject = field.getObjectById(selectedObjectId) ?? null;
        if (selectedObject == null) setSelectedObjectId(null);
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

    const selectedObjectGraphics: React.JSX.Element[] = [];
    if (selectedObject !== null) {
        selectedObjectGraphics.push(<circle key="outline" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.radius+3} fill="none" stroke="white" strokeWidth="2" />)
        if (selectedObject instanceof Animal) {
            selectedObjectGraphics.push(<circle key="vision-radius" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.stats.visionRadius} fill="none" stroke="#ffffff60" strokeWidth="2" strokeDasharray="10 20" />)
        }
    }

    return (
        <div className="simulation">
            <SimulationParams />
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
                                    onReset={() => setField(createField(width, height))}
                                    speed={speed} onSpeedChange={setSpeed} />
                <hr/>
                <SimulationStats simulationTime={field.simulationTime} plantsCount={field.plants.size} speciesCount={speciesCount} />
                <hr/>
                <ObjectInfo object={selectedObject} />
            </div>
        </div>
    );
}
