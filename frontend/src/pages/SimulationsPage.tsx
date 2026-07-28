import React from 'react';
import { WhatIfSimulator } from '../components/simulations/WhatIfSimulator';

export const SimulationsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <WhatIfSimulator />
    </div>
  );
};
