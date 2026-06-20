import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Simulation from './components/Simulation.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Simulation targetFPS={60} />
  </StrictMode>,
);
