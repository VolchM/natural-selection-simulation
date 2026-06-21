import { useEffect, useReducer, useState } from "react";
import SimulationField from "../simulation/SimulationField.tsx";
import Plant from "../simulation/Plant.tsx";
import Vector2 from '../simulation/Vector2.tsx';
import AnimalSpecie, { AnimalDiet } from "../simulation/AnimalSpecie.tsx";
import SimulationObject from "../simulation/SimulationObject.tsx";
import Animal from "../simulation/Animal.tsx";
import { randomRange } from "../Utils.tsx";
import SimulationParams from "./SimulationParams.tsx";
import SimulationControls from "./SimulationControls.tsx";
import SimulationStats from "./SimulationStats.tsx";
import ObjectInfo from "./ObjectInfo.tsx";
import "./Simulation.css";


function createField(width: number, height: number): SimulationField {
    const herbivoreSpecie = new AnimalSpecie({
        name: "Травоядное",
        diet: AnimalDiet.Herbivore,
        maxSpeed: 50,
        visionRadius: 92,
        maxSatiety: 100,
        maxStamina: 60,
        maxAge: 120,
        satietyValue: 60,
        radius: 7,
        color: "#ecd400",
    });
    const carnivoreSpecie = new AnimalSpecie({
        name: "Плотоядное",
        diet: AnimalDiet.Carnivore,
        eats: ["Травоядное"],
        maxSpeed: 80,
        visionRadius: 90,
        maxSatiety: 120,
        maxStamina: 80,
        maxAge: 90,
        satietyValue: 90,
        radius: 9,
        color: "#e20000",
    });

    const field = new SimulationField(width, height, [herbivoreSpecie, carnivoreSpecie], 4);
    for (let i = 0; i < 75; i++) {
        field.addPlant(new Plant(field, Vector2.random(0, field.width, 0, field.height), 50));
    }
    for (let i = 0; i < 40; i++) {
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), herbivoreSpecie, randomRange(0, 0.75 * herbivoreSpecie.maxAge)));
    }
    for (let i = 0; i < 12; i++) {
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), carnivoreSpecie, randomRange(0, 0.75 * carnivoreSpecie.maxAge)));
    }
    return field;
}

type SimulationProps = {
    targetFPS: number,
}

export default function Simulation({ targetFPS }: SimulationProps): React.JSX.Element {
    const width = 1500, height = 1000;
    const [field, setField] = useState(createField(width, height));
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
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
            selectedObjectGraphics.push(<circle key="vision-radius" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.specie.visionRadius} fill="none" stroke="#ffffff60" strokeWidth="2" strokeDasharray="10 20" />)
        }
    }

    return (
        <div className="simulation">
            <SimulationParams />
            <div className="container field-container">
                <svg className="field" width={field.width} height={field.height} viewBox={`0 0 ${field.width} ${field.height}`}>
                    <rect width="100%" height="100%" fill="transparent" onClick={deselectObject}/>
                    {field.renderObjects(selectObject)}
                    {selectedObjectGraphics}
                </svg>
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
