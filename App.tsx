import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { JournalEditor } from './components/JournalEditor';
import { EntryList } from './components/EntryList';
import { Chat } from './components/Chat';
import { AppView, JournalEntry, UserStats } from './types';

// Mock initial data
const INITIAL_ENTRIES: JournalEntry[] = [];

const INITIAL_STATS: UserStats = {
  daysSurvived: 142,
  entriesCount: 0,
  lastLocation: 'Hầm trú ẩn 04',
  healthStatus: 78
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  // Load from local storage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('apocalypse_entries');
    const savedStats = localStorage.getItem('apocalypse_stats');
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save to local storage when changed
  useEffect(() => {
    localStorage.setItem('apocalypse_entries', JSON.stringify(entries));
    localStorage.setItem('apocalypse_stats', JSON.stringify(stats));
  }, [entries, stats]);

  const handleSaveEntry = (newEntry: JournalEntry) => {
    setEntries(prev => [newEntry, ...prev]);
    setStats(prev => ({
        ...prev,
        entriesCount: prev.entriesCount + 1,
        lastLocation: newEntry.location,
        // Random fluctuation in health based on mood for simulation effect
        healthStatus: Math.min(100, Math.max(0, prev.healthStatus + (newEntry.mood === 'Hopeful' ? 2 : -1)))
    }));
    setView(AppView.ARCHIVE);
  };

  return (
    <Layout currentView={view} setView={setView}>
      {view === AppView.DASHBOARD && <Dashboard entries={entries} stats={stats} />}
      {view === AppView.EDITOR && <JournalEditor onSave={handleSaveEntry} nextId={entries.length + 1} />}
      {view === AppView.ARCHIVE && <EntryList entries={entries} />}
      {view === AppView.CHAT && <Chat />}
    </Layout>
  );
};

export default App;