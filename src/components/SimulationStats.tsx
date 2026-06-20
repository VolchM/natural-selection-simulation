import AnimalSpecie from "../simulation/AnimalSpecie";
import "./SimulationStats.css";

type SimulationStatsProps = {
    plantsCount: number,
    speciesCount: {
        specie: AnimalSpecie,
        count: number,
    }[]
}

export default function SimulationStats({ plantsCount, speciesCount }: SimulationStatsProps): React.JSX.Element {
    return (
        <div className="simulation-stats">
            <div className="stats-count">
                <span style={{color: "#1a9e00"}}>Растение:</span>
                <span>{plantsCount}</span>
            </div>
            {speciesCount.map(({specie, count}) => 
                <div key={specie.name} className="stats-count">
                    <span style={{color: specie.color}}>{specie.name}:</span>
                    <span>{count}</span>
                </div>
            )}
        </div>
    );
}