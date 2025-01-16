import React, { createContext, useContext, useState, ReactNode } from 'react';

type TabContextType = {
  handleTabClickk: (tab: string) => void;
  selectedTabb: string;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

type TabProviderProps = {
  children: ReactNode;
};

export const TabProvider: React.FC<TabProviderProps> = ({ children }) => {
  const [selectedTabb, setSelectedTabb] = useState<string>('appointments');

  const handleTabClickk = (tab: string) => {
    console.log(`Tab clicked: ${tab}`);
    setSelectedTabb(tab);
  };

  return (
    <TabContext.Provider value={{ handleTabClickk, selectedTabb }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};
