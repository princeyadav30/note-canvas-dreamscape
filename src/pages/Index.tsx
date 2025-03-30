
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Toolbar from '@/components/Toolbar';
import DrawingCanvas from '@/components/DrawingCanvas';
import NewNotebookModal from '@/components/NewNotebookModal';
import { useNoteStore } from '@/stores/noteStore';

const Index: React.FC = () => {
  const { 
    notebooks, 
    selectedNotebook, 
    selectNotebook,
    saveNotebook
  } = useNoteStore();

  // Select first notebook if none is selected
  useEffect(() => {
    if (!selectedNotebook && notebooks.length > 0) {
      selectNotebook(notebooks[0].id);
    }
  }, [notebooks, selectedNotebook, selectNotebook]);
  
  // Auto-save notebook periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedNotebook) {
        saveNotebook();
      }
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(interval);
  }, [selectedNotebook, saveNotebook]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Toolbar />
          {selectedNotebook ? (
            <DrawingCanvas width={800} height={1100} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-light">
              <p className="text-lg text-gray-500">
                Select a notebook or create a new one to get started
              </p>
            </div>
          )}
        </div>
      </div>
      <NewNotebookModal />
    </div>
  );
};

export default Index;
