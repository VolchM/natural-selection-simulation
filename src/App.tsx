import Simulation from './components/SImulation';
import './App.css';

export default function App(): React.JSX.Element {
    return <Simulation targetFPS={60} />;
}
