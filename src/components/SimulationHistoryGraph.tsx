import { clamp } from "../Utils";
import type { SimulationStep } from "./SimulationStats";

export type SimulationHistory = SimulationStep[];

type SimulationHistoryGraphProps = {
    simulationHistory: SimulationHistory,
    minWidth: number,
    maxWidth: number
    minHeight: number,
    maxHeight: number,
}

export default function SimulationHistoryGraph({ simulationHistory, minWidth, maxWidth, minHeight, maxHeight }: SimulationHistoryGraphProps): React.JSX.Element | null {
    if (simulationHistory.length == 0) {
        return null;
    }
    const plantsLine = simulationHistory.map(step => `${step.simulationTime},${step.plantsCount}`).join(" ");
    const animalLines = Array.from({length: simulationHistory[0].speciesCount.length}, (_, i) => ({
        specie: simulationHistory[0].speciesCount[i].specie,
        line: simulationHistory.map(step => `${step.simulationTime},${step.speciesCount[i].count}`).join(" ")
    }));

    const endTime = simulationHistory.at(-1)!.simulationTime;
    const width = clamp(endTime, minWidth, maxWidth);
    const start = endTime <= maxWidth ? 0 : endTime - maxWidth;

    const maxCount = Math.max(...simulationHistory
        .filter(step => step.simulationTime >= start)
        .map(step => Math.max(
            step.plantsCount,
            Math.max(...step.speciesCount.map(({count}) => count))
        ))
    );
    const height = clamp(maxCount, minHeight, maxHeight);

    return (
        <svg viewBox={`${start} 0 ${width} ${height}`}>
            <g transform={`scale(1,-1) translate(0, -${height})`}>
                <polyline points={plantsLine} fill="none" stroke="#1a9e00" strokeWidth={1} />
                {animalLines.map(({specie, line}) =>
                    <polyline key={specie.name} points={line} fill="none" stroke={specie.color} strokeWidth={1.5} />
                )}
            </g>
        </svg>
    );
}
