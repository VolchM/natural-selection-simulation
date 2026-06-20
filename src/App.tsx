import Simulation from './components/Simulation.tsx';
import './App.css';

export default function App(): React.JSX.Element {
    return <Simulation targetFPS={60} />;
}
