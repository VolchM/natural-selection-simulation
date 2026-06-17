import { useEffect, useReducer, useState } from "react";
import SimulationField from "./simulation/SimulationField.tsx";
import Plant from "./simulation/Plant.tsx";
import Vector2 from './simulation/Vector2.tsx';
import Animal from "./simulation/Animal.tsx";
import AnimalSpecie, { AnimalDiet } from "./simulation/AnimalSpecie.tsx";
import './App.css';

function createField(width: number, height: number): SimulationField {
    const herbivoreSpecie = new AnimalSpecie({
        name: "Herbivore",
        diet: AnimalDiet.Herbivore,
        maxSpeed: 50,
        visionRadius: 200,
        maxSatiety: 120,
        maxStamina: 80,
        maxAge: 60,
        radius: 7,
        color: "#ecd400",
    });
    const carnivoreSpecie = new AnimalSpecie({
        name: "Carnivore",
        diet: AnimalDiet.Carnivore,
        eats: ["Herbivore"],
        maxSpeed: 70,
        visionRadius: 300,
        maxSatiety: 100,
        maxStamina: 100,
        maxAge: 50,
        radius: 9,
        color: "#e20000",
    });
    function randomPos() {
        return new Vector2(Math.random() * width, Math.random() * height);
    }

    const field = new SimulationField(width, height);
    for (let i = 0; i < 100; i++) {
        field.addPlant(new Plant(field, randomPos()));
    }
    for (let i = 0; i < 70; i++) {
        field.addAnimal(new Animal(field, randomPos(), herbivoreSpecie));
    }
    for (let i = 0; i < 30; i++) {
        field.addAnimal(new Animal(field, randomPos(), carnivoreSpecie));
    }
    return field;
}

export default function App() {
    const [simulationField,] = useState(createField(1500, 800));
    const [,redrawField] = useReducer((tick) => tick + 1, 0);

    const tps = 60;
    useEffect(() => {
        function update() {
            simulationField.update(1 / tps);
            redrawField();
        }
        const intervalId = setInterval(update, 1000 / tps);
        return () => clearInterval(intervalId);
    }, [simulationField]);

    return (
        <svg width={simulationField.width} height={simulationField.height} viewBox={`0 0 ${simulationField.width} ${simulationField.height}`}>
            {simulationField.renderObjects()}
        </svg>
    );
}
