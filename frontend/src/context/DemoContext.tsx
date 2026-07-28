import React, { createContext, useContext, useState, useEffect } from 'react';
import { wsClient } from '../services/websocket';
import { triggerDemoScenario } from '../services/api';

interface DemoContextType {
  activeScenarioId: number | null;
  lastEvent: any;
  liveAgentSteps: any[];
  triggerScenario: (id: number) => Promise<void>;
  clearLogs: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [liveAgentSteps, setLiveAgentSteps] = useState<any[]>([]);

  useEffect(() => {
    wsClient.connect();
    const unsubscribe = wsClient.subscribe((msg) => {
      setLastEvent(msg);

      if (msg.type === 'AGENT_STEP') {
        setLiveAgentSteps((prev) => [msg.data.step, ...prev.slice(0, 49)]);
      } else if (msg.type === 'AGENT_SWARM_START') {
        setLiveAgentSteps([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerScenario = async (id: number) => {
    setActiveScenarioId(id);
    try {
      await triggerDemoScenario(id);
    } catch (e) {
      console.error('Failed to trigger demo scenario:', e);
    }
  };

  const clearLogs = () => setLiveAgentSteps([]);

  return (
    <DemoContext.Provider value={{ activeScenarioId, lastEvent, liveAgentSteps, triggerScenario, clearLogs }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
};
