import SimulationField from "../simulation/SimulationField.ts";
import SimulationObject from "../simulation/SimulationObject.ts";
import Animal from "../simulation/Animal.ts";
import plusIcon from "../assets/plus.svg";
import minusIcon from "../assets/minus.svg";
import { useState } from "react";
import "./SimulationFieldView.css";

function renderObjects(field: SimulationField, setSelectedObjectId: (value: number | null) => void, setTempSelectedObjectId: (value: number | null) => void): React.JSX.Element[] {
    return [...field.plants.values(), ...field.animals.values()].map(obj =>
        <circle
            key={obj.id}
            cx={obj.pos.x}
            cy={obj.pos.y}
            r={obj.radius}
            fill={obj.color}
            stroke="transparent"
            strokeWidth={20}
            cursor="pointer"
            onClick={() => setSelectedObjectId(obj.id)}
            onMouseEnter={() => setTempSelectedObjectId(obj.id)}
            onMouseLeave={() => setTempSelectedObjectId(null)}
        />
    );
}

function getSelectedObjectGraphics(selectedObject: SimulationObject | null, opacity: number = 1): React.JSX.Element[] {
    if (selectedObject === null) return [];

    const graphics = [];
    graphics.push(
        <circle key="outline" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.radius+3}
                fill="none" stroke="white" strokeWidth="2" pointerEvents="none" opacity={opacity} />
    );
    if (selectedObject instanceof Animal) {
        graphics.push(
            <circle key="vision-radius" cx={selectedObject.pos.x} cy={selectedObject.pos.y} r={selectedObject.stats.visionRadius}
                    fill="none" stroke="#ffffff60" strokeWidth="2" strokeDasharray="10 20" pointerEvents="none" opacity={opacity} />
        );
    }
    return graphics;
}

type SimulationFieldViewProps = {
    field: SimulationField,
    selectedObjectId: number | null,
    setSelectedObjectId: (value: number | null) => void,
    tempSelectedObjectId: number | null,
    setTempSelectedObjectId: (value: number | null) => void,
}

export default function SimulationFieldView({ field, selectedObjectId, setSelectedObjectId, tempSelectedObjectId, setTempSelectedObjectId }: SimulationFieldViewProps) {
    const [zoom, setZoom] = useState(1.0);

    let selectedObject: SimulationObject | null = selectedObjectId === null ? null : field.getObjectById(selectedObjectId) ?? null;
    if (selectedObject === null) {
        selectedObject = tempSelectedObjectId === null ? null : field.getObjectById(tempSelectedObjectId) ?? null;
    }

    let tempSelectedObject: SimulationObject | null = null;
    if (selectedObjectId !== null && tempSelectedObjectId !== null && selectedObjectId !== tempSelectedObjectId) {
        tempSelectedObject = field.getObjectById(tempSelectedObjectId) ?? null;
    }

    return (
        <div className="container field-container">
            <div className="field-scroll">
                <svg className="field" width={field.width * zoom} height={field.height * zoom} viewBox={`0 0 ${field.width} ${field.height}`}>
                    <rect width="100%" height="100%" fill="transparent" onClick={() => setSelectedObjectId(null)}/>
                    {renderObjects(field, setSelectedObjectId, setTempSelectedObjectId)}
                    {getSelectedObjectGraphics(tempSelectedObject, 0.8)}
                    {getSelectedObjectGraphics(selectedObject)}
                </svg>
            </div>
            <button className="zoom-button zoom-plus" onClick={() => setZoom(zoom * 1.2)}><img src={plusIcon} /></button>
            <button className="zoom-button zoom-minus" onClick={() => setZoom(zoom / 1.2)}><img src={minusIcon} /></button>
        </div>
    );
}
