import { useEffect, useReducer, useState } from "react";
import SimulationField from "./simulation/SimulationField.tsx";
import Plant from "./simulation/Plant.tsx";
import HerbivoreAnimal from './simulation/HerbivoreAnimal.tsx';
import CarnivoreAnimal from './simulation/CarnivoreAnimal.tsx';
import Vector2 from './simulation/Vector2.ts';
import './App.css';

function createField(): SimulationField {
    const field = new SimulationField(1500, 800);

    for (let i = 0; i < 30; i++) {
        field.addObject(new CarnivoreAnimal(field, new Vector2(Math.random() * 1500, Math.random() * 800)));
    }
    for (let i = 0; i < 100; i++) {
        field.addObject(new HerbivoreAnimal(field, new Vector2(Math.random() * 1500, Math.random() * 800)));
    }
    for (let i = 0; i < 100; i++) {
        field.addObject(new Plant(field, new Vector2(Math.random() * 1500, Math.random() * 800)));
    }

    return field;
}

export default function App() {
    const [simulationField,] = useState(createField());
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
