import AnimalSpecie from "../simulation/AnimalSpecie";
import "./SimulationStats.css";

export type SimulationStep = {
    simulationTime: number,
    plantsCount: number,
    speciesCount: {
        specie: AnimalSpecie,
        count: number,
    }[]
};

export default function SimulationStats({ simulationStep }: { simulationStep: SimulationStep }): React.JSX.Element {
    return (
        <div className="simulation-stats">
            <div>
                <span>Время симуляции:</span>
                <span>{simulationStep.simulationTime.toFixed(1)}</span>
            </div>
            <div>
                <span style={{color: "#1a9e00"}}>Растение:</span>
                <span>{simulationStep.plantsCount}</span>
            </div>
            {simulationStep.speciesCount.map(({specie, count}) => 
                <div key={specie.name}>
                    <span style={{color: specie.color}}>{specie.name}:</span>
                    <span>{count}</span>
                </div>
            )}
        </div>
    );
}