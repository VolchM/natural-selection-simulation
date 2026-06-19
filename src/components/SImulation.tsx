import { useEffect, useReducer, useState } from "react";
import SimulationField from "../simulation/SimulationField.tsx";
import Plant from "../simulation/Plant.tsx";
import Vector2 from '../simulation/Vector2.tsx';
import AnimalSpecie, { AnimalDiet } from "../simulation/AnimalSpecie.tsx";
import Animal from "../simulation/Animal.tsx";
import { randomRange } from "../Utils.tsx";
import "./Simulation.css";

function createField(width: number, height: number): SimulationField {
    const herbivoreSpecie = new AnimalSpecie({
        name: "Herbivore",
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
        name: "Carnivore",
        diet: AnimalDiet.Carnivore,
        eats: ["Herbivore"],
        maxSpeed: 80,
        visionRadius: 90,
        maxSatiety: 120,
        maxStamina: 80,
        maxAge: 90,
        satietyValue: 90,
        radius: 9,
        color: "#e20000",
    });

    const field = new SimulationField(width, height, 4);
    for (let i = 0; i < 75; i++) {
        field.addPlant(new Plant(field, Vector2.random(0, field.width, 0, field.height), 50));
    }
    for (let i = 0; i < 40; i++) {
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), herbivoreSpecie, randomRange(2.0, 15.0)));
    }
    for (let i = 0; i < 12; i++) {
        field.addAnimal(new Animal(field, Vector2.random(0, field.width, 0, field.height), carnivoreSpecie, randomRange(2.0, 15.0)));
    }
    return field;
}

export default function Simulation({ targetFPS }: { targetFPS: number }): React.JSX.Element {
    const [simulationField,] = useState(createField(1500, 1000));
    const [,redrawField] = useReducer((tick) => tick + 1, 0);

    useEffect(() => {
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
                    simulationField.update(deltaTime);
                } else {
                    // Окно не было активным
                    simulationField.update(targetFrameLength);
                }
                redrawField();
            }
            requestID = requestAnimationFrame(step);
        }

        return () => cancelAnimationFrame(requestID);
    }, [simulationField, targetFPS]);
    
    return (
        <svg width={simulationField.width} height={simulationField.height} viewBox={`0 0 ${simulationField.width} ${simulationField.height}`}>
            {simulationField.renderObjects()}
        </svg>
    );
}