import AnimalSpecie from "../simulation/AnimalSpecie";
import "./SimulationStats.css";

type SimulationStatsProps = {
    simulationTime: number,
    plantsCount: number,
    speciesCount: {
        specie: AnimalSpecie,
        count: number,
    }[]
}

export default function SimulationStats({ simulationTime, plantsCount, speciesCount }: SimulationStatsProps): React.JSX.Element {
    return (
        <div className="simulation-stats">
            <div>
                <span>Время симуляции:</span>
                <span>{simulationTime.toFixed(1)}</span>
            </div>
            <div>
                <span style={{color: "#1a9e00"}}>Растение:</span>
                <span>{plantsCount}</span>
            </div>
            {speciesCount.map(({specie, count}) => 
                <div key={specie.name}>
                    <span style={{color: specie.color}}>{specie.name}:</span>
                    <span>{count}</span>
                </div>
            )}
        </div>
    );
}